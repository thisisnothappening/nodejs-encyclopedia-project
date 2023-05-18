pipeline {
	agent {
		node {
			label "encyclopedia-project-agent"
		}
	}
	stages {
	    stage("Checkout") {
	        steps {
	           git branch: 'main', url: 'https://github.com/thisisnothappening/nodejs-encyclopedia-project'
	        }
	    }
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
		stage("Push Image") {
			steps {
			    withCredentials([
			        string(credentialsId: 'docker-login-password', variable: 'DOCKER_PASSWORD')
			        ]) {
			        sh "docker build -t nodejs-encyclopedia-project:cors-dev -f Dockerfile.dev ."
			        sh "docker tag nodejs-encyclopedia-project:cors-dev thisisnothappening/nodejs-encyclopedia-project:cors-dev"
			        sh 'docker login --username thisisnothappening --password $DOCKER_PASSWORD'
			        sh "docker push thisisnothappening/nodejs-encyclopedia-project:cors-dev"
			        sh "docker image prune -a -f"
			    }
			}
		}
		stage("Deploy") {
		    steps{
		        withCredentials([
					sshUserPrivateKey(credentialsId: 'amazon-linux-vm-key', keyFileVariable: 'KEYFILE'),
					string(credentialsId: 'ec2-ssh-user-and-dns', variable: 'TOKEN')
					]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $KEYFILE $TOKEN '
                        cd .server &&
                        sudo docker-compose stop backend &&
                        sudo docker container prune -f &&
                        sudo docker-compose up -d &&
                        sudo docker image prune -a -f
                        '
                    '''
				}
		    }
		}
	}
}