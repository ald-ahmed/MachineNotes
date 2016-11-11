# MachineNotes
a tool helping researchers annotate images for AI training data 

One of the hardest challenges a researcher can face is acquiring the training data necessary to train an AI project. This tool uses a simple, intuitive design in order to facilitate labeling image data by using JQuery, PHP, and MySQL. 

The program enables researchers to collaboratively work on a set of images. Each image is ‘checked-out’, meaning that each researcher will always get a new image not yet labeled, and thereby rapidly increasing the productivity of the project. In order to keep the data as secure as possible, Machine Notes is made to run with local, enumerated images located in the folder “data”. A command file is included to batch enumerate files in the folder data. 

Machine Notes allows the head researcher to dynamically create the feature sets used for labeling. While these feature sets are limited to binary checkboxes (yes or no selections), current progress is being made on how to improve the system and allow more flexibility. 

One of the current goals is to migrate from PHP and MySQL to Node and MongoDB.  
