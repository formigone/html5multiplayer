java -jar /usr/local/google-closure/compiler.jar \
    --js game.js \
    --manage_closure_dependencies true \
    --only_closure_dependencies \
    --js node_modules/google-closure-library/closure/goog/** \
    --closure_entry_point='rokko.main' \
    --compilation_level ADVANCED \
    --js src/** \
    --output_manifest manifest.txt

cat manifest.txt
