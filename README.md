# 3D_pose_modeling

A project that is going to take regular video footage and provides an output 3D model. The final goal of this project is to allow a single video's movements to be compared to another videos movements regardless of the angle and other factors that the videos are taken in

## User Types
1) Coach
    - These are the content creators for this platform. The idea would be that I can take a single angle video, which is going to display the drill or movement that the coach is trying to get the player to do.
2) User
    - These are users that are going to be accessing the content uploaded by the coaches


## Steps to take
1) Set up a Front-End repo, and set up a Backend Repo
    - Main thing is need to be able to upload videos to front, and work with them on back.
2) Set up a Pose Estimation module to gather information
3) Figure out how I can do Keypoint trajectories over time to capture the characteristic motion patterns
4) Extract relevant features from the pose and motion data that capture the essence of the movement patterns.
5) Need to be able to upload a second video from a slightly different angle and distance and store that as a second video
6) Run the same pose estimation and motion analysis on second video.
7) Compare the movement patterns between the two videos.
8) Determine the threshold or similarity score that we want to have for them to be considered similar 

## Outline for how I see this project working
1) Take input video from Coachs
    - Simple upload of video
2) Create 3D model of movement/drill that is being taught
    - I'm not sure how to do this right now.
3) Take pose estimation of user doing drill
    - I've done this a couple of times, so shouldn't be too tough. Will need to figure out how to make sure that I'm considering light and distance. I think that if I revisit the OpenCV stuff, there is some helpful stuff in there about saturation and edge detection.
4) Compare the angle that the user is filming from to the same angle of the 3D model
    - Another thing I don't know how to do right now.
5) Provide feed back to player.
    - Probably best to provide some visual feedback?
    - Typically the lines and circles are used, and this is pretty easy with OpenCV.

## Things I need to figure out
1)How do I create a 3D model of a persons movement
    
- What are the values that I need to pass into this?
- Can I get those values from a OpenCV pose estimation?
- Is it ok to only have values that are in reference to the front of someones body?
    - This feels like it should be fine, because the back of the body is being moved by the front of the body, so there isn't anything unexpected back there.

2) How do I determine the angle from which the user video is being taken?
    - Maybe I'll need to refer to the angle of the shoulders?
    - Should this all be relative to the original model?
        - Probably yes. 
3) How do I take that model and "move it" to match the angle of the second video?
    - If I've created the 3D model, I just need to set the "camera angle" from which I need to do a comparison of movements.
4) Can I compare the values from the "moved model" to the user video?
    - I've done this before, but very roughly. The problem that I had before was that nothing was standardized, so I wasn't getting the right values.
5) Is it better to standardize the Coaches model and then move the Users around that model, or is it better to do the opposite?
    - I'm thinking that the computational power required to create the 3D model is going to be higher than the pose estimation, so creating the 3D model should be done as few times as possible.
    - So I really just need to figure out which option is cheaper and quicker and then apply that to the Users.

## Look into
1) Perspective-n-point (PnP) pose estimation


## Ideas
- I could use a good 2D tracker for the users, and once I've been able to model move camera for the coach to match the user, then just compare the 2D pose of the coach over the user to determine how close the movements are.

- I think I want to think about this without necessarily moving to a 3D model. 
     - If we take my 2D pose estimation keypoints, I just need to figure out
        1) How to determine the users angle from and scale compared to the original video.
        2) The formula for adjusting the pose estmiation model to match the original video, or vice versa. Think of it as trying to capture the same set of stars from different angles. 
    - If I did it this way, it might actually be easier, and then I wouldn't need to computational resources required to create a 3D model.


## A way of potentially solving this
Here's a general outline of how you can confirm that the two photos likely depict the same object:

1) 2D Keypoint Detection: Apply keypoint detection to each frame in the video to identify relevant keypoints for the object or person you are interested in. The keypoints should be consistent across frames to ensure accurate tracking.

2) Correspondence Matching: Establish correspondences between keypoints across consecutive frames. This is typically achieved using feature matching techniques (e.g., SIFT, SURF, ORB) or deep learning-based methods (e.g., matching keypoints with neural networks).

3) Motion Estimation: With correspondences established, you can use motion estimation techniques (e.g., optical flow) to track the keypoints' movement between frames. This step helps ensure the keypoints are consistently tracked, even in cases of partial occlusions or object deformations.

4) PnP Pose Estimation: For each frame, apply PnP pose estimation to estimate the 3D pose of the object or person relative to the camera. You can use the 2D-3D correspondences obtained from the previous steps as input to the PnP algorithm.

5) Comparison of Poses: Compare the estimated poses across different frames to assess their similarity. You can use metrics like Euclidean distance, quaternion distance, or angle differences between the orientations to quantify the similarity.

6) Temporal Consistency: To further improve accuracy, consider the temporal consistency of the poses. The pose should change smoothly and gradually over time, assuming the object or person is moving naturally.

Here is an apporach for 2 videos with two different people

1) Pose Estimation: Apply pose estimation to both videos to extract the keypoint information for each person's movement in each frame. This will give you the 2D or 3D coordinates of the keypoints representing their body joints or relevant points.

2) Motion Analysis: Perform motion analysis to understand the temporal dynamics of the movements. You can use techniques like motion trajectories, velocity analysis, or keypoint trajectories over time to capture the characteristic motion patterns.

3) Feature Extraction: Extract relevant features from the pose and motion data that capture the essence of the movement patterns. These features might include joint angles, velocities, or any other relevant descriptors that represent the movement.

4) Similarity Metrics: Define similarity metrics to compare the movement patterns between the two videos. You may use distance metrics (e.g., Euclidean distance, cosine similarity) or more advanced techniques like dynamic time warping (DTW) to compare the feature sequences and quantify their similarity.

5) Thresholding and Classification: Set an appropriate threshold or similarity score to determine if the movements are similar or dissimilar. Depending on your threshold, you can classify the movements as either the "same" movement or "different" movements.




## Technologies

Front-end: Javascript (React), SASS, HTML

Backend: Leaning towards Python (Jest) for interactions, as well as Python for the OpenCV computing. I might switch this to C++ once it's built just because I'll get better performance, but the ease of using Python for this is going to outweight to performance benefits of C++ right now I think.

DB: NoSQL, unless something drastically changes. I think that the flexibility of not needing the same values for every single entry is going to be beneficial. It will also make querying the database much quicker


## Resources
https://medium.com/@alexeyyurasov/3d-modeling-with-python-c21296756db2
- Guide for turning plot points into a stl file (which can be 3D printed)

https://www.researchgate.net/profile/Gerard-Pons-Moll/publication/335290763_360-Degree_Textures_of_People_in_Clothing_from_a_Single_Image/links/5d89c5a0458515cbd1be39f1/360-Degree-Textures-of-People-in-Clothing-from-a-Single-Image.pdf
- Research paper for turning a single photo into a 3D model.


https://openaccess.thecvf.com/content_CVPR_2020/papers/Zhang_Object-Occluded_Human_Shape_and_Pose_Estimation_From_a_Single_Color_CVPR_2020_paper.pdf
- Similar to the one above

https://openaccess.thecvf.com/content/ICCV2021/papers/Zheng_3D_Human_Pose_Estimation_With_Spatial_and_Temporal_Transformers_ICCV_2021_paper.pdf
- A specific transformers technology used in pose estimation

https://openaccess.thecvf.com/content_ICCV_2019/papers/Ci_Optimizing_Network_Structure_for_3D_Human_Pose_Estimation_ICCV_2019_paper.pdf

https://openaccess.thecvf.com/content_ICCV_2019/papers/Cheng_Occlusion-Aware_Networks_for_3D_Human_Pose_Estimation_in_Video_ICCV_2019_paper.pdf


### Printed:


### Read:
https://openaccess.thecvf.com/content_CVPR_2019/papers/Pavllo_3D_Human_Pose_Estimation_in_Video_With_Temporal_Convolutions_and_CVPR_2019_paper.pdf
- This was an interesting article it gave a good model for generating a 3D model for a human pose based on a 2D video.
- Another interesting bit was that they provided an option for a casual convolution model that could be useful for the live video processing (When a user its comparing itself to a coach).
- A full on dialated convolution model seemed to provide an accurate 3D model of a users placement in camera space.

https://openaccess.thecvf.com/content_CVPR_2019/papers/Sun_Deep_High-Resolution_Representation_Learning_for_Human_Pose_Estimation_CVPR_2019_paper.pdf
- The model presented here was fucosed on making 2D pose recognition as accurate as possible.
- Maybe worth looking more into once I figure out the other stuff surrounding POV movement etc.

https://openaccess.thecvf.com/content/CVPR2022/papers/Weng_HumanNeRF_Free-Viewpoint_Rendering_of_Moving_People_From_Monocular_Video_CVPR_2022_paper.pdf
- Focusing on reconstructing an image or a frame from a video from another angle. 
- Really heavy with the math, and no github repo to reference.




## Current Step
- We have the annotated video with Pose-Recognition processed and stored in the frames.
- Need to look into Motion Analysis


# Important
- When we are going to compare videos, we are going to use Dynamic Time Warping. I'll need to look into how this works in regards to different camera angles, but it seems like it might be a good fit. 


# Full Scale Implementation
I think that I can get set it up so that on the website that's where coaches can upload new videos and that's where we can do a bunch of the processing for the videos. That way when we are going to use the mobile application we only need to load the data from the database and compare it to the stream from the phone.

Of course, we will be able to run the full application through the website as well,and the only thing that we wont be able to do on the mobile application is upload new videos from the coaches?