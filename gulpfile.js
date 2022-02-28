const fs = require('fs');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");

gulp.task('mini', () => (
  gulp.src('script/relationship.js')
  .pipe(uglify({
    output:{
      comments: function(node, comment){
        return /^!/.test(comment.value);
      }
    }
  }))
  .pipe(rename("relationship.min.js"))
  .pipe(gulp.dest('dist/'))
  
));