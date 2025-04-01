import os
import shutil
import torch
import cv2
import numpy as np
from PIL import Image
from torchvision import transforms
from app.model import SiameseNeuralNetwork,FinalLayer


class Verification:
    def __init__(self,user_name,user_id):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.embeddings_layer=SiameseNeuralNetwork().to(self.device)
        self.final_layer=FinalLayer().to(self.device)
        self.embedding_model_pth=os.path.join('app','face_model','EMBEDDING_MODEL.pth')
        self.final_layer_pth=os.path.join('app','face_model','FINAL_MODEL.pth')
        self.embeddings_layer.load_state_dict(torch.load(self.embedding_model_pth))
        self.final_layer.load_state_dict(torch.load(self.final_layer_pth))
        self.embeddings_layer.eval()
        self.final_layer.eval()
        self.transform_image = transforms.Compose([
            transforms.Resize((105, 105)),  
            transforms.ToTensor()
        ])
        self.user_name=user_name
        self.user_id=user_id
        
    def compute_l1_distance(self,anchor_embeddings,validation_embeddings):
        self.l1_distance = torch.abs(anchor_embeddings - validation_embeddings)
        return self.l1_distance
    
    def preprocess(self,path):
        img = Image.open(path).convert('RGB')
        img = self.transform_image(img)
        return img.view(1, 3, 105, 105).to(self.device)
    
    def verify_face(self,detection_threshold=0.5,verification_threshold=0.5):
        results=[]
        for image in os.listdir(os.path.join('app','application_data','verification',f'{self.user_name}_{self.user_id}')):
            input_image=self.preprocess(os.path.join('app','application_data','input','input_image.jpg'))
            verification_image=self.preprocess(os.path.join('app','application_data','verification',f'{self.user_name}_{self.user_id}',image))
            input=self.embeddings_layer(input_image)
            verification=self.embeddings_layer(verification_image)
            distance = self.compute_l1_distance(input, verification)
            pred = self.final_layer(distance).squeeze()  
            results.append(pred)
        
        results=[pred.item() for pred in results]
        detection=np.sum(np.array(results)>detection_threshold)
        verification=detection/62
        verified=verification > verification_threshold
        return results,verified
    
    def cam(self):
        cap=cv2.VideoCapture(0)
        while cap.isOpened():
            res,frame=cap.read()
            frame = cv2.resize(frame, (250, 250))
            cv2.imshow("Image",frame)
            cv2.imwrite(os.path.join('app','application_data','input','input_image.jpg'),frame)
            results,verified=self.verify_face()
            print(verified)
            if cv2.waitKey(1) & 0XFF==ord('q'):
                break
        cap.release()
        cv2.destroyAllWindows()
        
Verification('Veer',62).cam()