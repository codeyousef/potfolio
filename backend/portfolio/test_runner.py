from django.test.runner import DiscoverRunner
from django.db import connections

class TestRunner(DiscoverRunner):
    """
    Custom test runner that resets the database between test runs.
    """

    def setup_databases(self, **kwargs):
        """Set up the test databases."""
        # Call the parent method to set up the databases
        result = super().setup_databases(**kwargs)

        # Return the result
        return result

    def teardown_databases(self, old_config, **kwargs):
        """Tear down the test databases."""
        # Call the parent method to tear down the databases
        super().teardown_databases(old_config, **kwargs)

    def run_tests(self, test_labels, extra_tests=None, **kwargs):
        """Run the tests."""
        # Reset the database connections before each test
        for connection in connections.all():
            connection.close()

        # Call the parent method to run the tests
        return super().run_tests(test_labels, extra_tests=extra_tests, **kwargs)
