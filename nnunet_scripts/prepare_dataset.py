import os
from nnUnet import nnUNetManager

def prepare():
    manager = nnUNetManager("501")
    
    # 示例配置
    labels = {
        "background": 0,
        "spine": 1
    }
    channel_names = {
        "0": "CT"
    }
    
    # 假设你有 10 个训练样本
    num_training = 10
    
    manager.generate_dataset_json(
        name="Spine",
        description="Spine segmentation dataset",
        labels=labels,
        channel_names=channel_names,
        num_training=num_training
    )

if __name__ == "__main__":
    prepare()
