java -jar /usr/local/google-closure/compiler.jar \
    --js game.js \
    --js node_modules/google-closure-library/closure/goog/** \
    --js src/rokko/** \
    --manage_closure_dependencies true \
    --only_closure_dependencies \
    --closure_entry_point='rokko.main' \
    --compilation_level ADVANCED \
    --output_manifest manifest.txt

cat manifest.txt
