import os
import sys
import subprocess
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
        cmd = ["nnUNetv2_plan_and_preprocess", "-d", self.dataset_id, "-c", configuration]
        print(f"Executing: {' '.join(cmd)}")
        subprocess.run(cmd, check=True)

    def run_training(self, fold: int = 0, configuration: str = "3d_fullres", trainer: str = "nnUNetTrainer"):
        """
        启动训练
        对应命令: nnUNetv2_train DATASET_ID CONFIGURATION FOLD
        """
        print(f"Initializing {trainer} for {configuration}, Fold {fold}...")
        cmd = ["nnUNetv2_train", self.dataset_id, configuration, str(fold)]
        print(f"Executing: {' '.join(cmd)}")
        # 注意: 训练可能需要很长时间，建议在后台运行
        subprocess.run(cmd, check=True)

    def run_inference(self, input_folder: str, output_folder: str, configuration: str = "3d_fullres", fold: int = 0):
        """
        执行推理
        对应命令: nnUNetv2_predict -i INPUT -o OUTPUT -d DATASET_ID -c CONFIGURATION -f FOLD
        """
        print(f"Running inference on {input_folder}...")
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        
        cmd = [
            "nnUNetv2_predict",
            "-i", input_folder,
            "-o", output_folder,
            "-d", self.dataset_id,
            "-c", configuration,
            "-f", str(fold)
        ]
        print(f"Executing: {' '.join(cmd)}")
        subprocess.run(cmd, check=True)

    def convert_dicom_to_nifti(self, dicom_dir: str, output_file: str):
        """
        使用 SimpleITK 将 DICOM 序列转换为 NIfTI (AutoDL 推荐方式)
        """
        try:
            import SimpleITK as sitk
            print(f"Converting DICOM from {dicom_dir} to {output_file}...")
            reader = sitk.ImageSeriesReader()
            dicom_names = reader.GetGDCMSeriesFileNames(dicom_dir)
            if not dicom_names:
                raise ValueError(f"No DICOM files found in {dicom_dir}")
            reader.SetFileNames(dicom_names)
            image = reader.Execute()
            sitk.WriteImage(image, output_file)
            print(f"Conversion successful: {output_file}")
        except Exception as e:
            print(f"Conversion failed: {e}")
            print("Tip: If you have compressed DICOMs, try 'conda install -c conda-forge gdcm'")

    def generate_dataset_json(self, name: str, description: str, labels: dict, channel_names: dict, num_training: int, file_ending: str = ".nii.gz"):
        """
        生成 nnU-Net v2 所需的 dataset.json 文件
        """
        import json
        dataset_json = {
            "channel_names": channel_names,
            "labels": labels,
            "numTraining": num_training,
            "file_ending": file_ending,
            "name": name,
            "description": description,
            "reference": "nnU-Net v2",
            "licence": "Apache 2.0",
            "release": "1.0"
        }
        
        output_dir = os.path.join(os.environ['nnUNet_raw'], f"Dataset{self.dataset_id}_{name}")
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        output_file = os.path.join(output_dir, "dataset.json")
        with open(output_file, "w") as f:
            json.dump(dataset_json, f, indent=4)
        print(f"Generated dataset.json at {output_file}")

if __name__ == "__main__":
    # 测试初始化
    manager = nnUNetManager()
    print("nnU-Net Manager initialized.")
