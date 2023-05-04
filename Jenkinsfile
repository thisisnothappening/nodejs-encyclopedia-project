pipeline {
	agent {
		node {
			label "encyclopedia-project-agent"
		}
	}
	triggers {
        pollSCM '* * * * *'
    }
	stages {
		stage("Build") {
			steps {
				sh "npm install"
			}
		}
		stage("Test") {
			steps {
				sh "npm test"
			}
		}
		stage("Deploy") {
			// when  {
			// 	anyOf {
      		// 		branch 'main'
      		// 		branch 'master'
   			// 	}
			// }
			steps {
				// sh "docker build -t nodejs-encyclopedia-project:alpine-cors-prod-latest ."
				// sh "docker tag nodejs-encyclopedia-project:alpine-cors-prod-latest thisisnothappening/nodejs-encyclopedia-project:alpine-cors-prod-latest"
				// sh "docker push thisisnothappening/nodejs-encyclopedia-project:alpine-cors-prod-latest"

				withCredentials([
					sshUserPrivateKey(credentialsId: 'amazon-linux-vm-key', keyFileVariable: 'KEYFILE'),
					string(credentialsId: 'ec2-ssh-user-and-dns', variable: 'TOKEN')
					]) {
					sshagent(credentials: ['amazon-linux-vm-key']) {
                    	sh "ssh -o StrictHostKeyChecking=no -i $KEYFILE $TOKEN ' \
						cd ~ && \
						mkdir test \
						'"
                	}
				}
			}
		}
	}
}