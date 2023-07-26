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



