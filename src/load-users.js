
module.exports = async ({github, context, owner, repo, userFile}) => {
        
    console.log(`repo = ${repo}`)
    try {
    const yml = await github.rest.repos.getContent({
        owner: owner,
        repo: repo,
        path: userFile
    })
    console.log(`repo = ${repo}`)
    console.log(`yml result = ${yml}`)
    console.log(`end`)
    
    } catch (error) {
    console.log(`No ${userFile} file found in repository: ${repo}: ${error}`)
    }

    //const parsed = YAML.parse(content)

}