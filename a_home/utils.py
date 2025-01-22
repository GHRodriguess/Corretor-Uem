import os
from utils import global_utils as gu

def get_vestibulares() -> dict:
    result = {}     
    base_dir = gu.base_dir()    
    vestibulares = [vestibular for vestibular in sorted(os.listdir(base_dir), reverse=True)]        
    imgs = [os.path.join("media", vestibular, "img.jpg") for vestibular in vestibulares]    
    status = [os.path.exists(os.path.join(base_dir, vestibular, "GABARITOS")) and len(os.listdir(os.path.join(base_dir, vestibular, "GABARITOS"))) >= 1 for vestibular in vestibulares]
    status = ["done" if s else "loading" for s in status]
    urls = [vestibular.replace(" ", "-").lower()[4:] for vestibular in vestibulares]
    for vestibular, img, s, url in zip(vestibulares, imgs, status, urls):
        result[vestibular[4:]] = {
            "img": img,
            "status": s,
            "url": url,
        }
    return result