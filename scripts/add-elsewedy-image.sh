#!/bin/sh
# Run from project root after placing ElsewedyElectric.png in the root folder.
# Copies it to public/assets/img/awardees/elsewedy-electric.png and commits.

set -e
cd "$(dirname "$0")/.."

if [ ! -f "ElsewedyElectric.png" ]; then
  echo "Error: ElsewedyElectric.png not found in project root. Please place the file there and run again."
  exit 1
fi

cp "ElsewedyElectric.png" "public/assets/img/awardees/elsewedy-electric.png"
git add "public/assets/img/awardees/elsewedy-electric.png"
git status
echo ""
echo "Staged. Commit with: git commit -m 'Add Elsewedy Electric profile image'"
exit 0
