# interactive_detector
Repository for the Interactive Detector online game

Starting upload to github with the game at stage where random base 5 number is generated and user inputs answer with buttons.

6/4: In this update the game should be easy to integrate the tracks into. The game file no longer uses the React library, which was unneccesarily complicated, the display now also uses a whole detector instead of the quarter segement. At this point there is still the same game of show a random base 5 answer with button inputs but some files have been renamed and it's been restructured - so easy comparison may not be possible.

9/4: All the elements of the game are now fully functioning. Tracks are now fully working and now working on mainly aesthetic additions - highlighting subdetector info boxes on click, adding the rules etc. The main issues now are working on resizing the detector for different screens and generally just making the page look more appealing including fun facts, links to more info or more.

18/4: Updated the files with one which is responsive to different window sizes (although the canvas hasn't been fixed to change from 400x400)

19/4: Open new branch to start adding an introduction in the form of a multi-step dialog box. Fixing the canvas resizing issue, and improve resolution by setting the canvas dimensions to be much larger then it scales accordingly (this has caused issues with the ability to click on subdetectors and highlight the info - will need fixing if we wanna keep this feature)
