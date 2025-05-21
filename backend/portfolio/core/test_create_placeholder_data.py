"""
Test script to verify that the placeholder data creation works correctly.
"""
from django.core.management import call_command

if __name__ == "__main__":
    # Call the management command to create placeholder data
    call_command('create_placeholder_data')
    print("Placeholder data creation test completed.")