module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      client: {
        src: ['./snake-ch3/share/app.client.js'],
        dest: './snake-ch3/public/js/app.build.js'
      }
    },
    watch: {
      files: ['**/*'],
      tasks: ['browserify']
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);

};
