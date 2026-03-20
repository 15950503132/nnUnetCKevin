# nnU-Net v2 environment variables
import os

# Set these to your actual paths
os.environ['nnUNet_raw'] = os.path.join(os.getcwd(), 'nnUNet_raw')
os.environ['nnUNet_preprocessed'] = os.path.join(os.getcwd(), 'nnUNet_preprocessed')
os.environ['nnUNet_results'] = os.path.join(os.getcwd(), 'nnUNet_results')

def setup_folders():
    folders = [
        os.environ['nnUNet_raw'],
        os.environ['nnUNet_preprocessed'],
        os.environ['nnUNet_results'],
        os.path.join(os.environ['nnUNet_raw'], 'Dataset501_Spine/imagesTr'),
        os.path.join(os.environ['nnUNet_raw'], 'Dataset501_Spine/labelsTr'),
        os.path.join(os.environ['nnUNet_raw'], 'Dataset501_Spine/imagesTs'),
    ]
    for f in folders:
        os.makedirs(f, exist_ok=True)
        print(f"Created: {f}")

if __name__ == "__main__":
    setup_folders()
