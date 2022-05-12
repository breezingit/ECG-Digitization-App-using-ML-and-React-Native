import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage.restoration import denoise_tv_chambolle
from skimage.filters import threshold_otsu,gaussian
from skimage.transform import resize
from skimage import measure
from skimage import color
from skimage.io import imread
from PIL import Image
from io import BytesIO

def taking_input(path):
    img = cv2.imread(path)
    img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    return img

def Extracting_R_Channel(img):
    (B,G,R) = cv2.split(img)
    return cv2.cvtColor(R, cv2.COLOR_GRAY2BGR)

def image_enhancement(img):
    dst= cv2.dilate(img, None, iterations=1)
    i=2;
    while i>0:
        i-=1;
        dst = cv2.fastNlMeansDenoisingColored(dst,None,10,10,7,21)
        dst = cv2.GaussianBlur(dst, (1,1), 1)

    dst = cv2.cvtColor(dst, cv2.COLOR_BGR2GRAY)
    return dst

def Thresholding_of_image(dst):
    
    ret, thresh1 = cv2.threshold(dst, 120, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    return thresh1

def binarisation(dst):
    global_thresh = threshold_otsu(dst)
    binary_global = dst < global_thresh
    return binary_global
    
    
def contours(binary_global,ax4):
    
#     ax4[0].imshow(binary_global,cmap='gray')
    contours = measure.find_contours(binary_global,0.7)
    contours_shape = sorted([x.shape for x in contours])[::-1][0:1]
    for contour in contours:
      if contour.shape in contours_shape:
        test = resize(contour, (255, 2))
        ax4.plot(contour[:, 1], contour[:, 0],linewidth=1,color='black')
        
    
    print(contours_shape)
    return contours_shape

def getScanned(imageData):
    pil_image = Image.open(BytesIO(bytes(imageData)))
    open_cv_image = np.array(pil_image) 
    # Convert RGB to BGR 
    img1 = open_cv_image[:, :, ::-1].copy() 
    # img1 = taking_input('image.jpeg')
    img2 = Extracting_R_Channel(img1)
    img3 = image_enhancement(img2)
    img5 = binarisation(img3)
    img4 = Thresholding_of_image(img3)
    fig,ax=plt.subplots()
    fig.set_size_inches(6, 3)
    ax.invert_yaxis()
    contour_value = contours(img5,ax)
    # fig.savefig('plot.png')
    
    # plt fig to PIL object
    
    buf = BytesIO()
    fig.savefig(buf)
    buf.seek(0)
    image = Image.open(buf)
    ######

    rgb_im = image.convert('RGB')
    rgb_im.save('plot.jpg')
    # return "DONE"
    return rgb_im


# In[ ]:




