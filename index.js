      var imgdir = "";     
      var selectedr = null;
      var selectedc = null;
      var maxposts = 3;
      var maxdisks = 7;
      var all_posts = 3;
      var startpost = 0;
      var endpost = 2;
      var disks = 4;
      var imgwidth = 160;
      var imgheight = 14;
      var game_is_over = false;
      var show_messages = false;
      var board = new Array(maxposts);
      board[0] = new Array(maxdisks + 1);
      board[1] = new Array(maxdisks + 1);
      board[2] = new Array(maxdisks + 1);

      function preload() {
         this.length = preload.arguments.length;
         for (var i = 0; i < this.length; i++) {
         this[i] = new Image();
         this[i].src = imgdir + preload.arguments[i];
            }
         }
         
         var pics = new preload("disk1.gif","disk2.gif",
         "disk3.gif","disk4.gif","disk5.gif","disk6.gif",
         "disk7.gif","pole.gif", "disk1h.gif","disk2h.gif",
         "disk3h.gif","disk4h.gif","disk5h.gif","disk6h.gif",
         "disk7h.gif");
      
      function initboard(startpost, disks) {
      var len = board[0].length;
      selectedc = null;
      selectedr = null;
      game_is_over = false;
      endpost = (startpost-1 < 0 ? maxposts-1 : startpost-1);
      
      for (i = 0; i < len; i++) {
      board[0][i] = 0;
      board[1][i] = 0;
      board[2][i] = 0;
      }
      for (i = len-disks, j = 0; i < len; i++, j++) {
      board[startpost][i] = len - j - 1;
         }
      }
      
      function drawall() {
      for (j=0; j<board.length; j++) {
      for (i=0; i<board[j].length; i++) {
      draw(j,i, getName( board[j][i]));
         }
      }
      message("You may begin! Select a piece to move.");
      }
      
      function restart(start) {
      startpost = start;
      disks = document.forms[0].disc.options[document.forms[0].disc.selectedIndex].text;
      initboard(startpost,disks);
      drawall();
      theAnim = new Animation();
      }
      initboard(startpost, disks);
      
      function getName( num ) {
      if (num == 0) return "post.gif";
      return "disk" + num + ".gif";
      }
      
      function message(str, force) {
      if (force || !game_is_over && !show_messages)
      document.disp.message.value = str;
      }
      
      function messageadd(str) {
      if (!game_is_over)
      document.disp.message.value = document.disp.message.value + "\n" + str;
      }
      
      function isempty(num) {
      for (i = 0; i < board[num].length; i++) {
      if ( board[num][i] != 0) return false;
      }
      return true;
      }
      
      function topmost(num) {
      for (i = 0; i < board[num].length; i++) {
      if (board[num][i] != 0) return  i;
      }
      return -1;
      }
      
      function ispost(i,j) {
      return (board[j][i] == 0);
      }
      
      function istopdisk(i,j) {
      return (board[j][i-1] == 0);
      }
      
      function drawboard() {
      document.writeln("<h2>The Towers of Hanoi</h2><p>");
      document.writeln("<table cellspacing=0 cellpadding=0 border=0>");
      document.write("<tr>");
      for (j = 0; j < board.length; j++) {
      document.write("<td>");
      document.write("<a href='javascript:clicked("+0+","+j+")'><img src='" + imgdir + "posttop.gif' border=0></a><br>");
      for (i=0; i< board[0].length; i++) {
      document.write("<a href='javascript:clicked("+i+","+j+")'>");
      document.write("<img src='" + imgdir + getName(board[j][i]) + "' name='pos"+ j + i + "' border=0><br>");
      document.write("</a>");
      }
      document.writeln("</td>");
      }
      document.write("</tr></table>");
      document.write("<form name='disp'><textarea name='message' wrap=virtual rows=2 cols=40></textarea><br>" +
      "Disks: <select name=\"disc\" size=1><option>3<option>4<option>5<option>6<option selected>4</select><input "
      +"type=button value=\"Start the Game Over\" onClick=\"restart(startpost);\"><input "
      +"type=button value=\"Solve It!\" onClick=\"restart(startpost);setTimeout('hanoi(disks,startpost,endpost)',300)\"></form>");
      }
      
      function draw(x,y,name) {
      document.images["pos"+x+""+y].src = imgdir + name;
      }
      
      function animate(x,y,name) {
      theAnim.addFrame( "pos"+x+""+y, imgdir + name);
      }
      
      function clicked(i,j) {
      document.forms[0].message.focus(); // get rid of annoying outline in MSIE
      document.forms[0].message.blur();
      
      if (game_is_over)  restart(startpost = endpost);
      if (!isselection() && ispost(i,j)) { message("Select a piece to move."); return; }
      if (!ispost(i,j)) { toggle(j); return; };
      if (ispost(i,j) && selectedc == j) { message("Move the piece to a different post."); return; }
      if (!legalmove(j)) { message("That is not a legal move. Try again."); return; }
      move(j); return;
      }
      
      function legalmove(j) {
      if (isempty(j)) return true;
      return (board[j][topmost(j)] < board[selectedc][selectedr]);
      }
      
      function isselection() {
      return selectedc != null;
      }
      
      function toggle( num ) {
      var toppos = topmost(num);
      
      if (selectedc == num && selectedr == toppos) {
      selectedc = null; selectedr = null;
      animate(num,toppos,"disk" + board[num][toppos] + ".gif");
      message("Select a piece to move.");
      return;
      }
      if (isselection()) {
      animate(selectedc,selectedr,"disk" + board[selectedc][selectedr] + ".gif");
      }
      selectedc = num; selectedr = toppos;
      animate(num,toppos,"disk" + board[num][toppos] + "h.gif");
      message("Click on the post to which you want to move the disk.");
      }
      
      function move( num ) {
      var toppos = (!isempty(num) ? topmost(num) : board[num].length);
      board[num][toppos-1] = board[selectedc][selectedr];
      board[selectedc][selectedr] = 0;
      animate(selectedc,selectedr,"post.gif");
      animate(num,toppos-1,"disk" + board[num][toppos-1] + ".gif");
      selectedc = null; selectedr = null;
      message("Select a piece to move.");
      game_over();
      }
      
      function hanoi(no_of_disks, start_post, goal_post) {
      if (no_of_disks > 0) {
      var free_post = all_posts - start_post - goal_post;
      hanoi (no_of_disks - 1, start_post, free_post);
      show_messages = true;
      toggle(start_post);
      move(goal_post);
      show_messages = false;
      hanoi (no_of_disks - 1 , free_post, goal_post);
      game_over(true);
         }
      }
      
      function game_over(forceMsg) {
      var filledpost = null;
      var val = 0;
      for (k = 0; k < board.length; k++)  {
      val += ( isempty(k) ? 1 : 0 );
      if (!isempty(k)) filledpost = k;
      }
      
      if (val == 2 && isempty(startpost)) {
      message("You won!", forceMsg);
      game_is_over = true;
      endpost = filledpost;
      }
      return game_is_over;
      }
      
      //
      // Animation functions
      //
      
      function Animation() {
      this.imageNum = new Array();  // Array of indicies document.images to be changed
      this.imageSrc = new Array();  // Array of new srcs for imageNum array
      this.frameIndex = 0;          // the frame to play next
      this.alreadyPlaying = false;  // semaphore to ensure we play smoothly
      
      this.getFrameCount = getframecount;   // the total number of frame so far
      this.moreFrames = moreframes;         // tells us if there are more frames to play
      this.addFrame = addframe;             // add a frame to the animation
      this.drawNextFrame = drawnextframe;   // draws the next frame
      this.startAnimation = startanimation; // start the animation if necessary
      }
      
      function getframecount() {  return this.imageNum.length; }
      function moreframes() {  return this.frameIndex < this.getFrameCount(); }
      function startanimation() {
      if (!this.alreadyPlaying) {
      theAnim.alreadyPlaying = true;
      setTimeout('theAnim.drawNextFrame()',5);
         }
      }
      
      function addframe(num, src) {
      var theIndex = theAnim.imageNum.length;
      theAnim.imageSrc[theIndex] = src;
      theAnim.imageNum[theIndex] = num;
      theAnim.startAnimation();
      }
      
      function drawnextframe() {
      if (theAnim.moreFrames()) {
      document.images[ theAnim.imageNum[theAnim.frameIndex] ].src = theAnim.imageSrc[theAnim.frameIndex];
      theAnim.frameIndex++;
      setTimeout('theAnim.drawNextFrame()', 30);
      } else {
      theAnim.alreadyPlaying = false;
         }
      }
      
      drawboard();
      var theAnim = new Animation();
      message("You may begin! Select a piece to move.");
      document.disp.message.value = "";
      