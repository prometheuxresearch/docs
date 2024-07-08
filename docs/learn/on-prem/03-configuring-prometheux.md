# Configuring Prometheux

There are several properties that needs to be configured properly. These are are prefixed by `dist` special word. The property names are inherited by the ones declared in the Apache Spark framework.
Property name | Default value | What is it?
------------ | ------------- | -------------
dist.appName | vadalog | The name of the vadalog program submitted
dist.master | local[*] | The cluster manager to connect to. The allowed master URLs are listed in the next table
dist.driverMemory | 4g | Amount of memory to use for the driver process.
dist.executorMemory | 2g | Amount of memory to use per executor process. E.g. suppose we have 64 GB and 8 executor, then we have 8 GB of memory per executor.
dist.deployMode | client | Whether to deploy your driver on the worker nodes (cluster) or locally as an external client (client)
dist.enableSparkConnectors | true | Whether to use connectors or custom record managers for external sources
dist.batchSize | 10000 | Number of tuples to consume in a single batch when using custom record managers
dist.executorInstances | 4 | Number of executor per instance of each worker
dist.executorCores | 4 | Number of cores on each executor
dist.dynamicAllocationEnabled | false | Whether to allocate dynamically instances and cores
dist.adaptiveEnabled | true | Whether to enable a dynamic cost-based query plan execution at runtime.
dist.shufflePartitions | 4 | The number of partitions to use when shuffling data for joins or aggregations. If run in local[*] mode set this number as the number of your machine's core. If run in yarn mode set this number as the number of machine _ number of cores of each machine.
dist.checkpointDir | localCheckpoints | The dir to store local checkpoints for breaking lineage in iterative computations
dist.coalesce | false | Whether to unify the output source in one partition (supported only with local[_])

### Possible values for dist.master

| Value                           | What is it?                                                                                                                                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| local[k]                        | Run the distributed evaluation in local mode using k cores                                                                                                                                                                                                               |
| spark://HOST:PORT               | Connect to the given Spark standalone cluster master. The port must be whichever one your master is configured to use, which is 7077 by default                                                                                                                          |
| spark://HOST1:PORT1,HOST2:PORT2 | Connect to the given Spark standalone cluster with standby masters with Zookeeper. The list must have all the master hosts in the high availability cluster set up with Zookeeper. The port must be whichever each master is configured to use, which is 7077 by default |
| yarn                            | Connect to a YARN cluster in client or cluster mode depending on the value of dist.deploy.mode                                                                                                                                                                           |
| k8s://HOST:PORT                 | Connect to a Kubernetes cluster in client or cluster mode depending on the value of dist.deploy.mode                                                                                                                                                                     |