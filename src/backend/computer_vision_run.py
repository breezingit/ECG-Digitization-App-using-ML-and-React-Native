import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage.restoration import denoise_tv_chambolle
from skimage.filters import threshold_otsu, gaussian
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
import statistics
from io import BytesIO
from PIL import Image

def calc_dpi(pth):
    img = Image.open(pth)
    info = img._getexif()
    exifObj = {}
    if info != None:
        for tag, value in info.items():
            if tag in TAGS:
                exifObj[TAGS[tag]] = value
    print(exifObj)


def dydx(y, x):
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
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#     img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    return img


def Extracting_R_Channel(img):
    (B, G, R) = cv2.split(img)
    return cv2.cvtColor(R, cv2.COLOR_GRAY2BGR)


def invertColor(img):
    dst = 255-img
    return dst


def image_enhancement(img):
    dst = img
    i = 3
    while i > 0:
        i -= 1
        dst = cv2.fastNlMeansDenoisingColored(dst, None, 10, 10, 7, 21)
        dst = cv2.GaussianBlur(dst, (1, 1), 1)

    dst = cv2.cvtColor(dst, cv2.COLOR_BGR2GRAY)
    return dst


def Thresholding_of_image(dst):
    ret, thresh1 = cv2.threshold(
        dst, 120, 0, cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    th2 = cv2.adaptiveThreshold(
        dst, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 31, 6)
    th3 = cv2.adaptiveThreshold(
        dst, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    return th2


def binarisation(dst):
    global_thresh = threshold_otsu(dst)
    binary_global = dst < global_thresh
    return binary_global


def UBLB(img):
    #     kernel=np.ones((2, 2), 'uint8')
    dst = cv2.erode(img, None, iterations=1)
    height, width = dst.shape

    UB = 0
    LB = height-1
    # FIRST HI
    for h in range(height-1, -1, -1):
        find = 0
        for w in range(0, width):
            if(dst[h][w] == 1):
                find = 1
                LB = h
#                 print("LB FOUND")
#                 print(LB)
                break
        if find == 1:
            break
    for h in range(0, height):
        find = 0
        for w in range(0, width):
            if(dst[h][w] == 1):
                find = 1
                UB = h
#                 print("UB FOUND")
#                 print(UB)
                break
        if find == 1:
            break

    UB = max(UB-10, 0)
    LB = min(LB+10, height)
    img = img[UB:LB][:]
    print("UpperBound LowerBound", UB, LB)
    return UB, LB


def Denoise2(x, y, n):
    from scipy.signal import lfilter

#     n = 5  # the larger n is, the smoother curve will be
    b = [1.0 / n] * n
    a = 1
    yy = lfilter(b, a, y)
    return x, yy


def envelop(img, name):
    height, width = img.shape
    print(height, width)
    upper_envelops = []
    lower_envelops = []
    y_vals = []
    UM = 0
    LM = height-1

    for w in range(0, width):
        find = 0
        for h in range(0, height):
            if img[h][w] == 1:
                UM = h
                find += 1
                break
        for h in range(height-1, -1, -1):
            if img[h][w] == 1:
                LM = h
                find += 1
                break
        if find != 2:
            upper_envelops.append(np.nan)
            lower_envelops.append(np.nan)
        else:
            upper_envelops.append(UM)
            lower_envelops.append(LM)
        y_vals.append(w)
        UM = 0
        LM = height-1

    # Creating mean values
    median = []
    for i, j in zip(upper_envelops, lower_envelops):
        if i == np.nan or j == np.nan:
            median.append(nan)
        else:
            median.append((i+j)/2)

    a = pd.Series(median)
    a = a.interpolate(method='polynomial', order=3)
    median_final = np.asarray(a)
    axis = mode(median_final)
    if(len(axis) > 1):
        axis = statistics.mean(axis)
    fig, ax = plt.subplots()
    fig.set_size_inches(20, 5)
    ax.invert_yaxis()

    # shifted
    for i in range(len(median_final)):
        median_final[i] -= axis
    ax.plot(y_vals, median_final, color='blue')
    ax.axhline(y=0, color='red')
    ax.set_title(f"{name}")

    # DEnoising SIgnal
    x2, y2 = Denoise2(y_vals, median_final, 3)
#     ax[1].invert_yaxis()
#     ax[1].plot(x2, y2,color='black')

    # RPEAKS
    peaks = dydx(y2, x2)
    for i in range(len(peaks)):
        peaks[i] = min(20000, (peaks[i]**4))
#     ax[2].plot(y_vals[1:],peaks,color='green')

    # Averaging Window
    moving_window_signal = peaks.copy()
    WINDOW_SIZE = 15
    for i in y_vals[1:]:
        i = i-1
        index = 0
        curr = 0
        while (index < WINDOW_SIZE):
            if (i < index):
                break
            curr += peaks[i-index]
            index += 1

        moving_window_signal[i] = curr/index
    huehue, moving_window_signal = Denoise2(
        y_vals[1:], moving_window_signal, 7)
#     ax[2].plot(y_vals[1:],moving_window_signal,color='red')

    # Taking avg of graph and discaridng values below avg.
    avg = np.mean(moving_window_signal)
    new_moving_avg = [i if i > avg else 0 for i in moving_window_signal]
#     ax[2].plot(y_vals[1:],new_moving_avg,color='red')

    # PEAKS OF NEW_MOVING_AVG
    from scipy.signal import find_peaks
    indices = find_peaks(new_moving_avg)[0]
    yvals = [new_moving_avg[i] for i in indices]
    actual_indices = [i-15 for i in indices]

    final_idx = []
    for i in indices:
        curr_point = 0
        curr_index = 0
        for j in range(max(i-WINDOW_SIZE, 0), i+1):
            #             print(median_final[j])
            if abs(median_final[j]) > curr_point:
                curr_point = abs(median_final[j])
                curr_index = j
        final_idx.append(curr_index)

    peaks = [median_final[i] for i in final_idx]
#     for i in indices:
#         print(median_final[i-12])
#     ax[2].scatter(indices,yvals,color="black")
    ax.scatter(final_idx, peaks, color="black")

    if len(final_idx) == 1:
        fig.savefig(f'{name}.png')
        return
    sum_r = 0
    for i in range(len(final_idx)-1):
        sum_r += abs(final_idx[i+1]-final_idx[i])

    sum_r = sum_r/(len(final_idx)-1)

    # HR=60/RR
    RR = 60/(77)

    # X seconds
    # X number of pixel x times in sec/pixel
    # X sum_r X s/pixel
    s_per_pixel = RR/sum_r
    spixel = s_per_pixel*1000

    interval = 80/spixel
    interval = int(interval)

    # Qpeaks
    qpeaks = []
    qvalues = []
    for i in final_idx:
        # LOWEST POINT
        point = median_final[i]
        idx = i
        for j in range(i-interval, i):
            if point < median_final[j]:
                point = median_final[j]
                idx = j
        qpeaks.append(idx)
        qvalues.append(point)
    ax.scatter(qpeaks, qvalues, color="green")

    # SPEAKS
    speaks = []
    svalues = []
    for i in final_idx:
        # LOWEST POINT
        point = median_final[i]
        idx = i
        for j in range(i, min(interval+i+1, width)):
            if point < median_final[j]:
                point = median_final[j]
                idx = j
        speaks.append(idx)
        svalues.append(point)
    ax.scatter(speaks, svalues, color="brown")

    # PPEAKS
    interval = 200/spixel
    interval = int(interval)
    ppeaks = []
    pvalues = []
    for i in qpeaks:
        # LOWEST POINT
        point = median_final[i]
        idx = i
        for j in range(max(0, i-interval), i):
            if point > median_final[j]:
                point = median_final[j]
                idx = j
        ppeaks.append(idx)
        pvalues.append(point)
    ax.scatter(ppeaks, pvalues, color="red")

    # TPEAKS
    interval = 200/spixel
    interval = int(interval)
    tpeaks = []
    tvalues = []
    for i in speaks:
        # LOWEST POINT
        point = median_final[i]
        idx = i
        for j in range(i, min(i+interval+1, width)):
            if point > median_final[j]:
                point = median_final[j]
                idx = j
        tpeaks.append(idx)
        tvalues.append(point)
    ax.scatter(tpeaks, tvalues, color="magenta")

    buf = BytesIO()
    fig.savefig(buf)
    buf.seek(0)
    image = Image.open(buf)
    ######

    rgb_im = image.convert('RGB')
    rgb_im.save('plot.jpg')
    # return "DONE"
    return rgb_im
    # fig.savefig(f'{name}.png')


def saveImg(img, name):
    fig, ax = plt.subplots()
    fig.set_size_inches(20, 20)
    ax.imshow(img)
    fig.savefig(f'{name}.png')


def remove_dots(src):
    kernel = np.ones((2, 5), 'uint8')
    openingh = cv2.morphologyEx(src, cv2.MORPH_OPEN, kernel)
    kernel = np.ones((5, 2), 'uint8')
    openingv = cv2.morphologyEx(openingh, cv2.MORPH_OPEN, kernel)
    img = openingv
    _, blackAndWhite = cv2.threshold(
        img, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)

    nlabels, labels, stats, centroids = cv2.connectedComponentsWithStats(
        blackAndWhite, 4, cv2.CV_32S)
    sizes = stats[1:, -1]  # get CC_STAT_AREA component
    img2 = np.zeros((labels.shape), np.uint8)

    for i in range(0, nlabels - 1):
        if sizes[i] >= 90:  # filter small dotted regions
            img2[labels == i + 1] = 255

    res = cv2.bitwise_not(img2)
    return res


def ECG_Digitalise(img1, name):
    # calc_dpi('Clean_data/Lead-I.jpg')
    src = img1
    src[:, :, 2] = np.zeros([img1.shape[0], img1.shape[1]])

    img2 = img1
    # img2 = Extracting_R_Channel(img1)
    img3 = image_enhancement(img2)
    img4 = binarisation(img3)
    img5 = img4.astype('uint8')

#     fig,ax=plt.subplots(6,1)
#     fig.set_size_inches(20, 20)

#     ax[0].imshow(img1)
#     ax[1].imshow(img3)
#     ax[2].imshow(img4)
#     ax[3].imshow(img5)

    # REMOVING GRID LINES
    temp = remove_dots(img5)
    temp = 255-temp
    temp = temp//255
    kernel = np.ones((7, 7), 'uint8')
    openingv = cv2.morphologyEx(temp, cv2.MORPH_OPEN, kernel)
    kernel = np.ones((5, 5), 'uint8')
    openingv = cv2.morphologyEx(openingv, cv2.MORPH_OPEN, kernel)
    UB, LB = UBLB(openingv)
    img_final = temp[UB:LB][:]
#     saveImg(opening,"opening")

    return envelop(img_final, name)
    # return img_final

def getScanned(imageData):
    # img = taking_input("P0002.jpg")
    pil_img= Image.open(BytesIO(bytes(imageData)))

    # Shape of the image
    # print("Shape of the image", img.shape)
    # print("Shape of the image", img.shape)

    open_cv_image = np.array(pil_img)

    img = cv2.resize(open_cv_image, dsize=(3600, 2000), interpolation=cv2.INTER_CUBIC)

    # [rows, columns]
    col_1 = img[100:500, :]
    col_2 = img[600:1000, :]
    col_3 = img[1100:1500, :]

    lead_1 = col_1[:, 350:850]
    lead_avr = col_1[:, 1100:1600]
    lead_v1 = col_1[:, 1900:2400]
    lead_v4 = col_1[:, 2650:3150]

    lead_2 = col_2[:, 350:850]
    lead_avl = col_2[:, 1100:1600]
    lead_v2 = col_2[:, 1900:2400]
    lead_v5 = col_2[:, 2650:3150]

    lead_3 = col_3[:, 350:850]
    lead_avf = col_3[:, 1100:1600]
    lead_v3 = col_3[:, 1900:2400]
    lead_v6 = col_3[:, 2650:3150]

    lead_1 = cv2.resize(lead_1, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    lead_avl = cv2.resize(lead_avl, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    lead_v1 = cv2.resize(lead_v1, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    lead_v4 = cv2.resize(lead_v4, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    lead_2 = cv2.resize(lead_2, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    lead_avr = cv2.resize(lead_avr, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    lead_v2 = cv2.resize(lead_v2, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    lead_v5 = cv2.resize(lead_v5, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    lead_3 = cv2.resize(lead_3, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    lead_avf = cv2.resize(lead_avf, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    lead_v3 = cv2.resize(lead_v3, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    lead_v6 = cv2.resize(lead_v6, None, fx=1.5, fy=1.5,
                        interpolation=cv2.INTER_CUBIC)
    # fig2,ax2=plt.subplots()
    # fig2.set_size_inches(20, 20)
    # ax2.imshow(img)

    # fig,ax=plt.subplots(3,4)
    # fig.set_size_inches(20, 20)

    # ax[0][0].imshow(lead_1)
    # ax[0][1].imshow(lead_avr)
    # ax[0][2].imshow(lead_v1)
    # ax[0][3].imshow(lead_v4)

    # ax[1][0].imshow(lead_2)
    # ax[1][1].imshow(lead_avl)
    # ax[1][2].imshow(lead_v2)
    # ax[1][3].imshow(lead_v5)

    # ax[2][0].imshow(lead_3)
    # ax[2][1].imshow(lead_avf)
    # ax[2][2].imshow(lead_v3)
    # ax[2][3].imshow(lead_v6)


    lead_1 = ECG_Digitalise(lead_1, "lead_1")
    lead_2 = ECG_Digitalise(lead_2, "lead_2")
    lead_3 = ECG_Digitalise(lead_3, "lead_3")
    lead_v1 = ECG_Digitalise(lead_v1, "lead_v1")
    lead_v2 = ECG_Digitalise(lead_v2, "lead_v2")
    lead_v3 = ECG_Digitalise(lead_v3, "lead_v3")
    lead_v4 = ECG_Digitalise(lead_v4, "lead_v4")
    lead_v5 = ECG_Digitalise(lead_v5, "lead_v5")
    lead_v6 = ECG_Digitalise(lead_v6, "lead_v6")
    lead_avl = ECG_Digitalise(lead_avl, "lead_avl")
    lead_avr = ECG_Digitalise(lead_avr, "lead_avr")
    lead_avf = ECG_Digitalise(lead_avf, "lead_avf")

    leadList= [lead_1, lead_2, lead_3, lead_v1, lead_v2, lead_v3, lead_v4, lead_v5, lead_v6, lead_avl, lead_avr, lead_avf]
    return leadList

# fig1, ax1 = plt.subplots(3, 4)
# fig1.set_size_inches(20, 20)

# ax1[0][0].imshow(lead_1, cmap='gray')
# ax1[0][1].imshow(lead_avr, cmap='gray')
# ax1[0][2].imshow(lead_v1, cmap='gray')
# ax1[0][3].imshow(lead_v4, cmap='gray')

# ax1[1][0].imshow(lead_2, cmap='gray')
# ax1[1][1].imshow(lead_avl, cmap='gray')
# ax1[1][2].imshow(lead_v2, cmap='gray')
# ax1[1][3].imshow(lead_v5, cmap='gray')

# ax1[2][0].imshow(lead_3, cmap='gray')
# ax1[2][1].imshow(lead_avf, cmap='gray')
# ax1[2][2].imshow(lead_v3, cmap='gray')
# ax1[2][3].imshow(lead_v6, cmap='gray')

# saveImg(lead_v2,"lead_v2")
# img=cv2.imread('Clean_data/Lead-I.jpg')
# img=ECG_Digitalise(lead_2,"lead_1")
# cv2.imwrite("lead_3.jpg",lead_1)
