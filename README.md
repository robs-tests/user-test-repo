# user-test-repo

Example setup for easy onboarding for users in an org with predefined processes. Read more information [here](https://devopsjournal.io/blog/2022/03/12/GitHub-config-as-code).


# Process 1: Create users / teams / repos from a yaml file

1. Add new users and teams to the users.yml file
1. Create a PR
1. The workflow `pull_request.yml` workflow checks if: 
   - The user file is valid yaml
   - The users is a valid GitHub handle
   - The user is already a member of the organization
1. After merging, the `user-management.yml` workflow runs and:
   - Create the team if needed
   - Add the user to the org
   - Create repository `attendee-<userhandle>`
   - Add the user to the repo
   - Add the user to the team
   - Ad the team to the repo
