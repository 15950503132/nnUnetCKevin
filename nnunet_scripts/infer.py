import os
import sys
from nnUnet import nnUNetManager

def predict(input_folder, output_folder, dataset_id="501", configuration="3d_fullres", fold=0):
    """
    使用 nnUNetManager 执行推理
    """
    manager = nnUNetManager(dataset_id)
    manager.run_inference(input_folder, output_folder, configuration, fold)

if __name__ == "__main__":
    # 示例: 预测 'imagesTs' 中的图像并保存到 'predictions'
    input_dir = os.path.join(os.environ['nnUNet_raw'], 'Dataset501_Spine/imagesTs')
    output_dir = os.path.join(os.environ['nnUNet_results'], 'Dataset501_Spine/predictions')
    os.makedirs(output_dir, exist_ok=True)
    
    predict(input_dir, output_dir)
