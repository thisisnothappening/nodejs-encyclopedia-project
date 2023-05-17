provider "aws" {
  region = "eu-north-1"
}

resource "aws_security_group" "my_security_group" {
  name        = "my-security-group"
  description = "My security group"
  vpc_id      = "vpc-02698e4f80102fd40"

  ingress {
  	from_port   = 22
  	to_port     = 22
  	protocol    = "tcp"
  	cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
	from_port 	= 3000
	to_port 	= 3000
	protocol 	= "tcp"
	cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
  	from_port   = 0
  	to_port     = 0
  	protocol    = "all"
  	cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "encyclopedia_docker" {
  ami             = "ami-0a79730daaf45078a"
  instance_type   = "t3.micro"
  key_name        = "amazon_linux_vm_key"
  security_groups = [aws_security_group.my_security_group.name]
  tags = {
	Name = "Welcomepedia in Docker"
  }

  root_block_device {
    volume_size = 8
    volume_type = "gp3"
  }

  user_data = <<-EOF
	#!/bin/bash
	sudo fallocate -l 2G /swapfile
	sudo chmod 600 /swapfile
	sudo mkswap /swapfile
	sudo swapon /swapfile
	sudo sh -c 'echo "/swapfile swap swap defaults 0 0" >> /etc/fstab'
	sudo yum update -y
	sudo yum install -y docker
	sudo service docker start
	sudo chmod 666 /var/run/docker.sock
	sudo docker network create encyclopedia-network
	sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
  EOF
}

resource "aws_eip" "my_elastic_ip" {
  vpc = true
  instance = aws_instance.encyclopedia_docker.id
}