import cv2
import os
import shutil
import random

class CreateUserDataBase:
    def __init__(self,user_name,user_id):
        self.user_name=user_name
        self.user_id=user_id
        self.POS_PATH=os.path.join("app","data","positive",f"{self.user_name}_{self.user_id}")
        self.NEG_PATH=os.path.join("app","data","negative")
        self.ANC_PATH=os.path.join("app","data","anchor",f"{self.user_name}_{self.user_id}")
        self.directories = [self.POS_PATH,self.NEG_PATH,self.ANC_PATH]
        self.verfication_path = os.path.join("app", "application_data", "verification", f"{self.user_name}_{self.user_id}")
    
    def create_directories(self):
        for directory in self.directories:
            if not os.path.exists(directory):
                os.makedirs(directory)
                print(f"Created: {directory}")
            else:
                print(f"Already exists: {directory}")

    def load_images_from_for_verification(self,folder_path, num_images=62):
        image_files = [f for f in os.listdir(folder_path) if f.endswith('.jpg')]
        random.shuffle(image_files) 
        selected_images = image_files[:num_images] 
        images = [os.path.join(folder_path, f) for f in selected_images] 
        return images

    def create_verification_data(self,images, verification_path):
        os.makedirs(verification_path, exist_ok=True)  
        for image in images:
            src = image  
            dst = os.path.join(verification_path, os.path.basename(image)) 
            shutil.copy(src, dst)
        print(f"Copied {len(images)} images to {verification_path}")
    
    def create_training_data(self):
        i=0
        cap=cv2.VideoCapture(0)
        while cap.isOpened():
            res,frame=cap.read()
            frame = cv2.resize(frame, (250, 250))
            if i < 950:
                path=self.POS_PATH if i<=449 else self.ANC_PATH
                # if i%50==0:
                #     pass
                # if i==949:
                #     print("Saved All")
                img_name=os.path.join(self.ANC_PATH,f'Veer_{i}.jpg')
                cv2.imwrite(img_name,frame)
                i+=1
            cv2.imshow("Image",frame)
            if cv2.waitKey(1) & 0XFF==ord('q'):
                break
        cap.release()
        cv2.destroyAllWindows()
        
    