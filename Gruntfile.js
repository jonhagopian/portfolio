module.exports = function(grunt) {

  grunt.initConfig({
    sass: {
      options: {
        outputStyle: "expanded",
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: "app/resources/sass/",
          src: "**/*.scss",
          dest: "app/resources/css/",
          ext: ".css"
        }]
      }
    },
    watch: {
      files: "app/resources/sass/**/*.scss",
      tasks: "sass"
    }
  });

  grunt.loadNpmTasks("grunt-sass")
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["sass", "watch"]); //runs sass task first then watch by default, simply type 'grunt' at the command line.
};