#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { Ec2CustomAmiStack } from '../lib/ec2-custom-ami-stack';

const app = new cdk.App();


// this stack uses specific pre-defined resources, so that not only a region,
// but also the account id needs to be configured.
// change the respective ids to meet your requirements

new Ec2CustomAmiStack(app, 'Ec2CustomAmiStack', {
  env: {
    region: 'eu-central-1',
    account: '677675788676'
  }
});
