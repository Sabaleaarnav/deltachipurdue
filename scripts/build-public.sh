#!/bin/sh
set -eu

# Publish the current public pages and CMS. Draft pages stay in the repository.
rm -rf _site
mkdir _site
cp -R index.html donate.html 404.html admin assets _site/
