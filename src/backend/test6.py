import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage.restoration import denoise_tv_chambolle
from skimage.filters import threshold_otsu,gaussian
from skimage.transform import resize
from skimage import measure
from skimage import color
from skimage.io import imread
from skimage import morphology
import pandas as pd
from scipy import stats
from numpy import diff
from PIL import Image
from PIL.ExifTags import TAGS 
from io import BytesIO
def calc_dpi(pth):
    img = Image.open(pth)
    info = img._getexif()
    exifObj = {}
    if info != None:
        for tag, value in info.items():
            if tag in TAGS:
                exifObj[TAGS[tag]] = value
    print(exifObj)
    

def dydx(y,x):
    dydx = diff(y)/diff(x)
    return dydx


def mode(ls):
    # dictionary to keep count of each value
    counts = {}
    # iterate through the list
    for item in ls:
        if item in counts:
            counts[item] += 1
        else:
            counts[item] = 1
    # get the keys with the max counts
    return [key for key in counts.keys() if counts[key] == max(counts.values())]

def taking_input(path):
    img = cv2.imread(path)
    img=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
#     img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    return img

def Extracting_R_Channel(img):
    print(img.shape)
    # img=cv2.cvtColor(img, cv2.COLOR_BGRA2HSV)
    # img=cv2.cvtColor(img, cv2.COLOR_HSV2BGR)
    (R,G,B,A) = cv2.split(img)
    return img
    # return cv2.cvtColor(R, cv2.COLOR_GRAY2BGR)

def invertColor(img):
    dst=255-img
    return dst
    
def image_enhancement(img):
    dst=img
    i=3;
    while i>0:
        i-=1;
        dst = cv2.fastNlMeansDenoisingColored(dst,None,10,10,7,21)
        dst = cv2.GaussianBlur(dst, (1,1), 1)

    dst = cv2.cvtColor(dst, cv2.COLOR_BGR2GRAY)
    return dst

def Thresholding_of_image(dst):
    
    
    ret, thresh1 = cv2.threshold(dst, 120, 0, cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    th2 = cv2.adaptiveThreshold(dst,255,cv2.ADAPTIVE_THRESH_MEAN_C,cv2.THRESH_BINARY,31,6)
    th3 = cv2.adaptiveThreshold(dst,255,cv2.ADAPTIVE_THRESH_GAUSSIAN_C,cv2.THRESH_BINARY,11,2)
    return th2

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

def UBLB(img):
#     kernel=np.ones((2, 2), 'uint8')
    dst= cv2.erode(img, None, iterations=1)
    height,width=dst.shape
    
    UB=0
    LB=height-1
    #FIRST HI
    for h in range (height-1,-1,-1):
        find=0
        for w in range(0,width):
            if(dst[h][w] ==1):
                find=1
                LB=h
#                 print("LB FOUND")
#                 print(LB)
                break
        if find==1:
            break;
    for h in range (0,height):
        find=0
        for w in range(0,width):
            if(dst[h][w] ==1):
                find=1
                UB=h
#                 print("UB FOUND")
#                 print(UB)
                break
        if find==1:
            break;
    
    UB=max(UB-10,0)
    LB=min(LB+10,height)
    img=img[UB:LB][:]
    print(UB,LB)
    return img

def Denoise2(x,y,n):
    from scipy.signal import lfilter

#     n = 5  # the larger n is, the smoother curve will be
    b = [1.0 / n] * n
    a = 1
    yy = lfilter(b,a,y)
    return x,yy
    
    
def envelop(img):
    height,width=img.shape
    #print(height,width)
    upper_envelops=[]
    lower_envelops=[]
    y_vals=[]
    UM=0
    LM=height-1
    
    for w in range(0,width):
        find=0
        for h in range(0,height):
            if img[h][w]==1:
                UM=h
                find+=1
                break
        for h in range(height-1,-1,-1):
            if img[h][w]==1:
                LM=h
                find+=1
                break
        if find!=2:
            upper_envelops.append(np.nan)
            lower_envelops.append(np.nan)
        else:
            upper_envelops.append(UM)
            lower_envelops.append(LM)
        y_vals.append(w)
        UM=0
        LM=height-1 
        
    #Creating mean values    
    median=[]
    for i,j in zip(upper_envelops,lower_envelops):
        if i==np.nan or j==np.nan:
            median.append(nan)
        else:
            median.append((i+j)/2)
    
    a=pd.Series(median)
    a=a.interpolate(method='polynomial', order=3)
    median_final=np.asarray(a)
    axis=mode(median_final)
    
    fig,ax=plt.subplots()
    fig.set_size_inches(20, 5)
    ax.invert_yaxis()
    
    #shifted
    for i in range( len(median_final)):
        median_final[i]-=axis
    ax.plot(y_vals,median_final,color='blue')
    ax.axhline(y=0,color='red')


    #DEnoising SIgnal
    x2,y2=Denoise2(y_vals,median_final,3)
#     ax[1].invert_yaxis()
#     ax[1].plot(x2, y2,color='black')
    
    
    #RPEAKS
    peaks=dydx(y2,x2)
    for i in range(len(peaks)):
        peaks[i]=min(20000,(peaks[i]**4))
#     ax[2].plot(y_vals[1:],peaks,color='green')
    
    #Averaging Window
    moving_window_signal = peaks.copy()
    WINDOW_SIZE=15
    for i in y_vals[1:]:
        i=i-1
        index = 0
        curr = 0
        while (index < WINDOW_SIZE):
            if (i < index):
                break
            curr += peaks[i-index]
            index += 1

        moving_window_signal[i] = curr/index
    huehue,moving_window_signal=Denoise2(y_vals[1:],moving_window_signal,7)
#     ax[2].plot(y_vals[1:],moving_window_signal,color='red')
    
    #Taking avg of graph and discaridng values below avg.
    avg=np.mean(moving_window_signal);
    new_moving_avg=[i if i>avg else 0 for i in moving_window_signal]
#     ax[2].plot(y_vals[1:],new_moving_avg,color='red')    

    #PEAKS OF NEW_MOVING_AVG
    from scipy.signal import find_peaks
    indices = find_peaks(new_moving_avg)[0]
    yvals=[new_moving_avg[i] for i in indices]
    actual_indices=[i-15 for i in indices]
    
    final_idx=[]
    for i in indices:
        curr_point=0
        curr_index=0
        for j in range(max(i-WINDOW_SIZE,0),i+1):
#             print(median_final[j])
            if abs(median_final[j])>curr_point:
                curr_point=abs(median_final[j])
                curr_index=j
        final_idx.append(curr_index)
            
    peaks=[median_final[i] for i in final_idx]
#     for i in indices:
#         print(median_final[i-12])
#     ax[2].scatter(indices,yvals,color="black")
    ax.scatter(final_idx,peaks,color="black")

    sum_r=0
    for i in range(len(final_idx)-1):
        sum_r+=abs(final_idx[i+1]-final_idx[i])
    
    sum_r=sum_r/(len(final_idx)-1)
    
    #HR=60/RR
    RR=60/(77)
    
    #X seconds 
    #X number of pixel x times in sec/pixel
    #X sum_r X s/pixel
    s_per_pixel=RR/sum_r
    spixel=s_per_pixel*1000
    
    interval=80/spixel
    interval=int(interval)
    
    #Qpeaks
    qpeaks=[]
    qvalues=[]
    for i in final_idx:
        #LOWEST POINT
        point=median_final[i]
        idx=i
        for j in range(i-interval,i):
            if point<median_final[j]:
                point=median_final[j]
                idx=j
        qpeaks.append(idx)
        qvalues.append(point)
    ax.scatter(qpeaks,qvalues,color="green")
    
    #SPEAKS
    speaks=[]
    svalues=[]
    for i in final_idx:
        #LOWEST POINT
        point=median_final[i]
        idx=i
        for j in range(i,min(interval+i+1,width)):
            if point<median_final[j]:
                point=median_final[j]
                idx=j
        speaks.append(idx)
        svalues.append(point)
    ax.scatter(speaks,svalues,color="brown")
    
    
    #PPEAKS
    interval=200/spixel
    interval=int(interval)
    ppeaks=[]
    pvalues=[]
    for i in qpeaks:
        #LOWEST POINT
        point=median_final[i]
        idx=i
        for j in range(max(0,i-interval),i):
            if point>median_final[j]:
                point=median_final[j]
                idx=j
        ppeaks.append(idx)
        pvalues.append(point)
    ax.scatter(ppeaks,pvalues,color="red")

    #TPEAKS
    interval=200/spixel
    interval=int(interval)
    tpeaks=[]
    tvalues=[]
    for i in speaks:
        #LOWEST POINT
        point=median_final[i]
        idx=i
        for j in range(i,min(i+interval+1,width)):
            if point>median_final[j]:
                point=median_final[j]
                idx=j
        tpeaks.append(idx)
        tvalues.append(point)
    ax.scatter(tpeaks,tvalues,color="magenta")
    # fig.savefig('plot.png')
    buf = BytesIO()
    fig.savefig(buf)
    buf.seek(0)
    image = Image.open(buf)
    ######

    rgb_im = image.convert('RGB')
    rgb_im.save('plot.jpg')
    # return "DONE"
    return rgb_im

        
            
            
def getScanned(imageData):
# calc_dpi('Clean_data/Lead-I.jpg')
    pil_image = Image.open(BytesIO(bytes(imageData)))
    # pil_image= Image.open(imageData)
    # img1 = np.array(pil_image) 
    open_cv_image = np.array(pil_image) 
    # img1 = open_cv_image[:, :, ::-1].copy() 
    # img1 = taking_input('test1.jpg')
    img2 = Extracting_R_Channel(open_cv_image)
    img3=image_enhancement(img2)
    img4=binarisation(img3)
    img5=img4.astype('uint8')
    img6=UBLB(img5)

    # fig,ax=plt.subplots(2,1)
    # fig.set_size_inches(20, 20)

    kernel = np.ones((2, 2), 'uint8')
    opening = cv2.morphologyEx(img6, cv2.MORPH_OPEN, kernel)

    # ax[0].imshow(img5,cmap='gray')
    # ax[1].imshow(opening,cmap='gray')
    return envelop(opening)
# return envelop(opening)


#Plotting on matplotlib
# plt.plot(y_vals,x_vals)





