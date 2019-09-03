for file in *.obj; do vname=${file%.obj}; vnameU=$(echo "$vname" | tr '[:lower:]' '[:upper:]'); echo "$vnameU"; done

for file in *.obj; do echo "<script src="objects/car/$file"></script>"; done