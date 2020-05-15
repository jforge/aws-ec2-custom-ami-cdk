#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { Ec2CustomAmiStack } from '../lib/ec2-custom-ami-stack';

const app = new cdk.App();
new Ec2CustomAmiStack(app, 'Ec2CustomAmiStack');
