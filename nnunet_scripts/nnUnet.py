import os
import sys
from typing import Optional

# 确保环境变量已加载
try:
    from .setup_env import setup_folders
except ImportError:
    from setup_env import setup_folders

class nnUNetManager:
    """
    nnU-Net v2 核心管理类
    封装了 nnunetv2 库的常用操作，供 train.py 和 infer.py 调用
    """
    def __init__(self, dataset_id: str = "501"):
        self.dataset_id = dataset_id
        setup_folders()
        
        # 验证 nnunetv2 是否安装
        try:
            import nnunetv2
            print(f"Successfully imported nnunetv2 version: {nnunetv2.__version__}")
        except ImportError:
            print("Warning: nnunetv2 package not found. Please run 'pip install nnunetv2'")

    def plan_and_preprocess(self, configuration: str = "3d_fullres"):
        """
        数据规划与预处理
        对应命令: nnUNetv2_plan_and_preprocess -d DATASET_ID
        """
        print(f"Planning and preprocessing for Dataset {self.dataset_id}...")
        # 实际调用:
        # from nnunetv2.experiment_planning.plan_and_preprocess_api import extract_fingerprints, plan_experiments, preprocess
        # extract_fingerprints(self.dataset_id)
        # plan_experiments(self.dataset_id)
        # preprocess(self.dataset_id, [configuration])
        pass

    def run_training(self, fold: int = 0, configuration: str = "3d_fullres", trainer: str = "nnUNetTrainer"):
        """
        启动训练
        对应命令: nnUNetv2_train DATASET_ID CONFIGURATION FOLD
        """
        print(f"Initializing {trainer} for {configuration}, Fold {fold}...")
        # 实际调用:
        # from nnunetv2.run.run_training import run_training
        # run_training(self.dataset_id, configuration, fold, trainer, ...)
        pass

    def run_inference(self, input_folder: str, output_folder: str, configuration: str = "3d_fullres", fold: int = 0):
        """
        执行推理
        对应命令: nnUNetv2_predict -i INPUT -o OUTPUT -d DATASET_ID -c CONFIGURATION -f FOLD
        """
        print(f"Running inference on {input_folder}...")
        # 实际调用:
        # from nnunetv2.inference.predict_from_raw_data import nnUNetPredictor
        # predictor = nnUNetPredictor(...)
        # predictor.initialize_from_trained_model_folder(...)
        # predictor.predict_from_files(input_folder, output_folder, ...)
        pass

if __name__ == "__main__":
    # 测试初始化
    manager = nnUNetManager()
    print("nnU-Net Manager initialized.")
