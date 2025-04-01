import os
import torch
from torch.utils.data import DataLoader,Dataset,random_split
from torchvision import transforms
from PIL import Image

class SiameseDataset(Dataset):
    def __init__(self,pairs,apply_transforms=True):
        self.pairs=pairs
        self.transforms=transforms.Compose([
            transforms.Resize((105, 105)),
            transforms.ToTensor()
            ]) if apply_transforms else None
    
    def __len__(self):
        return len(self.pairs)
    
    def __getitem__(self, index):
    
        img_path1,img_path2,label=self.pairs[index]
        img1 = Image.open(img_path1).convert('RGB')
        img2 = Image.open(img_path2).convert('RGB')
        
        if self.transforms:
            img1 = self.transforms(img1)
            img2 = self.transforms(img2)
            
        return img1, img2, torch.tensor(label, dtype=torch.float32)
    
class LoadData:
    def __init__(self,user_name,user_id):
        self.user_name=user_name
        self.user_id=user_id
        self.POS_PATH=os.path.join("app","data","positive",f"{self.user_name}_{self.user_id}")
        self.NEG_PATH=os.path.join("app","data","negative")
        self.ANC_PATH=os.path.join("app","data","anchor",f"{self.user_name}_{self.user_id}")
        # self.verfication_path = os.path.join("app", "application_data", "verification", f"{self.user_name}_{self.user_id}")
    
    def load_images_from_folder(self,folder_path, max_images=450):
        self.image_files = sorted([f for f in os.listdir(folder_path) if f.endswith('.jpg')])[:max_images]
        self.images = [os.path.join(folder_path, f) for f in self.image_files]
        return self.images
    
    def create_siamese_pairs(self,anchor_paths, positive_paths, negative_paths):
        self.positive_pairs = list(zip(anchor_paths, positive_paths, [1.0] * len(anchor_paths)))
        self.negative_pairs = list(zip(anchor_paths, negative_paths[:len(anchor_paths)], [0.0] * len(anchor_paths)))
        self.all_pairs = self.positive_pairs + self.negative_pairs
        self.random.shuffle(self.all_pairs)  
        return self.all_pairs
    
    def load_training_data(self):
        anchor_paths = self.load_images_from_folder(self.ANC_PATH, max_images=450)
        positive_paths = self.load_images_from_folder(self.POS_PATH, max_images=450)
        negative_paths = self.load_images_from_folder(self.NEG_PATH, max_images=450)
        all_pairs = self.create_siamese_pairs(anchor_paths, positive_paths, negative_paths)
        split_idx = int(0.7 * len(all_pairs))
        train_pairs = all_pairs[:split_idx]
        test_pairs = all_pairs[split_idx:]
        train_data=SiameseDataset(train_pairs,apply_transforms=True)
        test_data=SiameseDataset(test_pairs,apply_transforms=True)
        train_loader = DataLoader(train_data, batch_size=16, shuffle=True)
        test_loader = DataLoader(test_data,shuffle=True)
        return train_loader,test_loader
        