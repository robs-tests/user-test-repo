
module.exports = async ({github, context, owner, repo, userFile, yaml}) => {
        
    console.log(`repo = ${repo}`)
    try {
    const yml = await github.rest.repos.getContent({
        owner: owner,
        repo: repo,
        path: userFile
    })
    console.log(`repo = ${repo}`)
    const parsed = YAML.parse(yml)
    console.log(`yml result = ${parsed}`)
    console.log(`end`)
    
    } catch (error) {
        console.log(`No ${userFile} file found in repository: ${repo}: ${error}`)
    }

    parsed.users.forEach(element => {
        console.log(`Found user: [${element}]`)
    });  

}