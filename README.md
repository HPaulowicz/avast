# avast
Avast engineering assessment


## The task

> Implement basic Electron/web application (running on localhost)  for viewing and editing recorded interaction with a website.

> Use the framework of your choice. The result does not have to be styled in any way.

> On startup, it will fetch a JSON file with recorded browser-website interaction. Serving the file is up to you (localhost or internet).

> Parse this file and show ‘records’ objects in the UI - ie. in a list.
> Use the framework of your choice. The result does not have to be styled in any way.

> On startup, it will fetch a JSON file with recorded browser-website interaction. Serving the file is up to you (localhost or internet).

> Parse this file and show ‘records’ objects in the UI - ie. in a list.
Items should display event type, HTML tag name (or some other representative value), and formatted date+time of the event.Items should display event type, HTML tag name (or some other representative value), and formatted date+time of the event.

> It should be possible to delete and reorder items.
There should be 2 buttons:
1. SAVE button will save the currently edited file to the Downloads folder.
2. STATS button will show simple statistics about the interaction:
- Counts of different event types
- Min/max/mean time delay between interactions
- Length of the longest sequence of following input events - after filtering out focus events
- Total time of the  interaction (sum of all the events)
- Feel free to add other interesting stats about the data
- NOTE: while calculating the Stats, please bear in mind that it should be able to process thousands of events at once. Try to make the code as effective as possible (optionally note possible alternative solutions in comments)

> Don’t spend too much time with it - especially with UI. Feel free to interpret uncertain information in your way. We’ll discuss it later.

> You can hand it in in any form as well - git repository or simple zip file. Please, send it by Monday EOD.

> Don’t hesitate to contact us in case of any questions on ondrej.masek@avast.com or jan.svehla@avast.com.


> Good luck!


------------


