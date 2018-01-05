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
    babel: {
      options: {
        sourceMap: false,
        presets: [{"env": {
            "targets": {
              "Explorer": "11"
            }
          }
        }]
      },
      dist: {
        files: [{
          "expand": true,
          "cwd": "app/resources/js/",
          "src": ["**/*.js"],
          "dest": "app/resources/js-babel/",
          "ext": "-babel.js"
        }]
      }
    },
    watch: {
      css: {
        files: "app/resources/sass/**/*.scss",
        tasks: "sass"
      },
      js: {
        files: "app/resources/js/*.js",
        tasks: "babel"
      }
    }
  });

  grunt.loadNpmTasks("grunt-sass");
  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["sass", "babel", "watch"]);
  //runs sass task first then watch by default,
  //babel
  //type 'grunt' at the command line.
};