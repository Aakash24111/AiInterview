import torch
import torch.nn as nn
import torch.nn.functional as F
from app.load_data import LoadData
import os

class SiameseNeuralNetwork(nn.Module):
    def __init__(self):
        super(SiameseNeuralNetwork, self).__init__()
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=64, kernel_size=10, stride=1)
        self.conv2 = nn.Conv2d(in_channels=64, out_channels=128, kernel_size=7)
        self.conv3 = nn.Conv2d(in_channels=128, out_channels=128, kernel_size=4)
        self.conv4 = nn.Conv2d(in_channels=128, out_channels=256, kernel_size=4)
        self.pool = nn.MaxPool2d(kernel_size=2)
        self.fc1 = nn.Linear(256 * 6 * 6, 4096)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x))) 
        x = self.pool(F.relu(self.conv2(x)))
        x = self.pool(F.relu(self.conv3(x))) 
        x = F.relu(self.conv4(x))              
        x = x.view(x.size(0), -1)             
        x = torch.sigmoid(self.fc1(x))         
        return x
    
class FinalLayer(nn.Module):
    def __init__(self):
        super(FinalLayer,self).__init__()
        self.linear=nn.Linear(4096,1)
    
    def forward(self,x):
        x=torch.sigmoid(self.linear(x))
        return x
    
class TrainNetwork:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.embedding_model = SiameseNeuralNetwork()
        self.final_layer = FinalLayer()
        self.embedding_model.to(self.device)
        self.final_layer.to(self.device)
        self.optimizer = torch.optim.Adam(list(self.embedding_model.parameters()) + list(self.final_layer.parameters()), lr=1e-4)
        self.criterion = nn.BCELoss()
        self.epochs=22
        self.load_data=LoadData('Veer',62)
        self.embedding_model_pth=os.path.join('app','face_model','EMBEDDING_MODEL.pth')
        self.final_layer_pth=os.path.join('app','face_model','FINAL_MODEL.pth')
        self.train_loader,self.test_loader=self.load_data.load_training_data()
        
    def compute_l1_distance(self,anchor_embeddings,validation_embeddings):
        self.l1_distance = torch.abs(anchor_embeddings - validation_embeddings)
        return self.l1_distance
    
    def train(self):
        for epoch in range(self.epochs):
            self.embedding_model.train()
            self.final_layer.train()
            total_loss = 0

            for img1, img2, label in self.train_loader:
                img1, img2, label = img1.to(self.device), img2.to(self.device), label.to(self.device)
                
                anchor_out = self.embedding_model(img1)      
                paired_out = self.embedding_model(img2)      
                distance = self.compute_l1_distance(anchor_out, paired_out) 

                pred = self.final_layer(distance).squeeze() 
                loss = self.criterion(pred, label)

                self.optimizer.zero_grad()
                loss.backward()
                self.optimizer.step()
                
                total_loss += loss.item()
                
            print(f"Epoch {epoch+1}/{self.epochs}, Loss: {total_loss:.4f}")
            
        torch.save(self.embedding_model.state_dict(),self.embedding_model_pth)
        torch.save(self.final_layer.state_dict(),self.final_layer_pth)