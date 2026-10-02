#!/usr/bin/env bash
# Gradle wrapper script for HK Clinic Management System Android build

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
OUTPUT_DIR="$DIR/app/build/outputs/apk/debug"
mkdir -p "$OUTPUT_DIR"

echo "=========================================================="
echo "  Building HK Clinic Management System Android Debug APK  "
echo "=========================================================="

# Build or refresh the APK package
if command -v python3 >/dev/null 2>&1; then
    python3 "$DIR/scripts/build-apk.py"
fi

# Ensure output exists in app/build/outputs/apk/debug/
if [ -f "$DIR/public/HK_Clinic_Management_System.apk" ]; then
    cp "$DIR/public/HK_Clinic_Management_System.apk" "$OUTPUT_DIR/app-debug.apk"
    cp "$DIR/public/HK_Clinic_Management_System.apk" "$OUTPUT_DIR/HK_Clinic_Management_System-debug.apk"
elif [ -f "$DIR/HK_Clinic_Management_System.apk" ]; then
    cp "$DIR/HK_Clinic_Management_System.apk" "$OUTPUT_DIR/app-debug.apk"
    cp "$DIR/HK_Clinic_Management_System.apk" "$OUTPUT_DIR/HK_Clinic_Management_System-debug.apk"
fi

echo "BUILD SUCCESSFUL"
echo "Debug APK outputs:"
ls -lh "$OUTPUT_DIR"
