# 3D_pose_modeling

A project that is going to take regular video footage and provides an output 3D model. The final goal of this project is to allow a single video's movements to be compared to another videos movements regardless of the angle and other factors that the videos are taken in

## User Types
1) Coach
    - These are the content creators for this platform. The idea would be that I can take a single angle video, which is going to display the drill or movement that the coach is trying to get the player to do.
2) User
    - These are users that are going to be accessing the content uploaded by the coaches

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


## Technologies

Front-end: Javascript (React), SASS, HTML

Backend: Leaning towards Python (Jest) for interactions, as well as Python for the OpenCV computing. I might switch this to C++ once it's built just because I'll get better performance, but the ease of using Python for this is going to outweight to performance benefits of C++ right now I think.

DB: NoSQL, unless something drastically changes. I think that the flexibility of not needing the same values for every single entry is going to be beneficial. It will also make querying the database much quicker


## Resources
https://medium.com/@alexeyyurasov/3d-modeling-with-python-c21296756db2
- Guide for turning plot points into a stl file (which can be 3D printed)

https://www.researchgate.net/profile/Gerard-Pons-Moll/publication/335290763_360-Degree_Textures_of_People_in_Clothing_from_a_Single_Image/links/5d89c5a0458515cbd1be39f1/360-Degree-Textures-of-People-in-Clothing-from-a-Single-Image.pdf
- Research paper for turning a single photo into a 3D model.

https://openaccess.thecvf.com/content/CVPR2022/papers/Weng_HumanNeRF_Free-Viewpoint_Rendering_of_Moving_People_From_Monocular_Video_CVPR_2022_paper.pdf
- research paper that allows camera angle to be changed in a video (looks very useful)

https://openaccess.thecvf.com/content_CVPR_2020/papers/Zhang_Object-Occluded_Human_Shape_and_Pose_Estimation_From_a_Single_Color_CVPR_2020_paper.pdf
- Similar to the one above

https://openaccess.thecvf.com/content/ICCV2021/papers/Zheng_3D_Human_Pose_Estimation_With_Spatial_and_Temporal_Transformers_ICCV_2021_paper.pdf
- A specific transformers technology used in pose estimation

https://openaccess.thecvf.com/content_ICCV_2019/papers/Ci_Optimizing_Network_Structure_for_3D_Human_Pose_Estimation_ICCV_2019_paper.pdf

https://openaccess.thecvf.com/content_ICCV_2019/papers/Cheng_Occlusion-Aware_Networks_for_3D_Human_Pose_Estimation_in_Video_ICCV_2019_paper.pdf

https://openaccess.thecvf.com/content_CVPR_2019/papers/Sun_Deep_High-Resolution_Representation_Learning_for_Human_Pose_Estimation_CVPR_2019_paper.pdf

https://openaccess.thecvf.com/content_CVPR_2019/papers/Pavllo_3D_Human_Pose_Estimation_in_Video_With_Temporal_Convolutions_and_CVPR_2019_paper.pdf
- Lets start with this one