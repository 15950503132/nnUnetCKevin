import os
import sys
from nnUnet import nnUNetManager

def train(dataset_id="501", fold=0, configuration="3d_fullres"):
    """
    使用 nnUNetManager 启动训练
    """
    manager = nnUNetManager(dataset_id)
    
    # 1. 数据规划与预处理 (通常只需运行一次)
    # manager.plan_and_preprocess(configuration)
    
    # 2. 启动训练
    manager.run_training(fold, configuration)

if __name__ == "__main__":
    train()
