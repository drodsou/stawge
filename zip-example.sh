#!/bin/bash
rm example.zip 2>/dev/null
zip -r example.zip example -x "**dist/*"