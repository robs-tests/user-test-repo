# user-test-repo

Example setup for easy onboarding for users in an org with predefined processes.


# Process 1: Create users / teams / repos from a yaml file

1. Add new users and teams to the users.yml file
1. Create a PR
1. The workflow `pull_request.yml` workflow checks if: 
  1. The user file is valid yaml
  1. The users is a valid GitHub handle
  1. The user is already a member of the organization
1. After merging, the `user-management.yml` workflow runs and:
  1. Create the team if needed
  1. Add the user to the org
  1. Create repository `attendee-<userhandle>`
  1. Add the user to the repo
  1. Add the user to the team
  1. Ad the team to the repo