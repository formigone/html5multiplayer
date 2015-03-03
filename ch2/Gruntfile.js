module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      client: {
        src: ['./app.js'],
        dest: 'bundle.js'
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
