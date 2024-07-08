import re
import torch
from kernel_utils import VideoReader, FaceExtractor, confident_strategy, predict_on_video
from training.zoo.classifiers import DeepFakeClassifier

from fastapi import Request, FastAPI, UploadFile, File
import uvicorn

app = FastAPI()

# GLOBAL VARIABLE
models = []


def load_models():

    model_paths = ["weights/" + model for model in [
        "final_111_DeepFakeClassifier_tf_efficientnet_b7_ns_0_36",
        "final_555_DeepFakeClassifier_tf_efficientnet_b7_ns_0_19",
        "final_777_DeepFakeClassifier_tf_efficientnet_b7_ns_0_29",
        "final_777_DeepFakeClassifier_tf_efficientnet_b7_ns_0_31",
        "final_888_DeepFakeClassifier_tf_efficientnet_b7_ns_0_37",
        "final_888_DeepFakeClassifier_tf_efficientnet_b7_ns_0_40",
        "final_999_DeepFakeClassifier_tf_efficientnet_b7_ns_0_23"
    ]]
    for path in model_paths:
        model = DeepFakeClassifier(encoder="tf_efficientnet_b7_ns").to("cuda")
        print("loading state dict {}".format(path))
        checkpoint = torch.load(path, map_location="cpu")
        state_dict = checkpoint.get("state_dict", checkpoint)
        model.load_state_dict({re.sub("^module.", "", k): v for k, v in state_dict.items()}, strict=True)
        model.eval()
        del checkpoint
        models.append(model.half())


def predict(path):
    frames_per_video = 32
    video_reader = VideoReader()
    video_read_fn = lambda x: video_reader.read_frames(x, num_frames=frames_per_video)

    face_extractor = FaceExtractor(video_read_fn)
    input_size = 380
    strategy = confident_strategy

    # filepath = 'input/1_fake.mp4'

    y_pred = predict_on_video(face_extractor=face_extractor, video_path=path, input_size=input_size, batch_size=frames_per_video, models=models, strategy=strategy, apply_compression=False)
    
    return y_pred


# load models
load_models()


@app.post("/predict/")
async def recognize(request: Request):

    json = await request.json()
    path = json['path']
    result = {}
    
    prediction = predict(path)

    result = {
        'code': 0,
        'result': str(prediction*100)
    }

    return result


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

# if __name__ == '__main__':

#     predictions = predict()

#     print(predictions)
    
