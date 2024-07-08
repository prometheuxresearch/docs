# Architecture

## DP Vadalog on cluster

DP Vadalog enables distributed and parallelised processing by converting the primitives (project, select, join) into map, filter, reduce and shuffle parallel trasformations that are invoked by a driver and executed in parallel on the cluster. At the moment DP Vadalog supports Yarn and Kubernetes cluster managers.

### DP Vadalog with Yarn

In this settings DP Vadalog relies on Yarn cluster manager that manages the execution of the a Vadalog program. An application master is responsible of handling the Vadalog program evaluation and of the interaction with the Yarn resource manager, to which issues for new resources. A driver interacts with the workers, distributes to them data to be processed and receives their response. Two deployment modes can be used when evaluating DP Vadalog with Yarn: Client mode and Cluster mode.

![Yarn client mode architecture diagram](dp-yarn-client.png?raw=true)

In Client mode, the Vadalog Driver resides on the Vadalog client. The Vadalog client submits the Vadalog program evaluation to the Yarn Resouce Manager. The Resource Manager elects the master, responsible of requesting for new workers (executors) as needed. The driver then communicates with the executors to marshal the Vadalog program execution and returns the progress, the results and the status to the Vadalog Client.

![Yarn cluster mode architecture diagram](dp-yarn-cluster.png?raw=true)

In Cluster mode, the driver resides in the cluster and it is handled by the application master. The Vadalog client submits the Vadalog program evaluation to the Yarn Resouce Manager. The Resource Manager elects the master, responsible of requesting for new workers(executors) as needed. The driver from inside the cluster communicates with the executors to marshal the program execution and returns the progress, the results and the status to the Vadalog Client.

### DP Vadalog with Kubernetes

In this settings DP Vadalog relies on Kubernetes cluster manager that manages the execution of a Vadalog program. The Vadalog client interacts directly with the Kubernetes Api Server on the master node, which asks to schedule pods on the worker nodes of the cluster. The Kubernetes Api Server instanciates the executors on the pods and the driver communicates with them for evaluating the Vadalog program. The driver itself can run either outside or inside of the client enviroment: client and cluster mode respectively.

![Kubernetes client mode architecture diagram](dp-k8s-client.png?raw=true)

In Client mode, the driver runs outside the cluster, in the Vadalog client. It can live inside or outside a pod. From outside the cluster the driver contacts the Kubernetes Api Server on the control plane node and asks to schedule executors, which are scheduled on pods on the worker nodes. The driver communicates with executors which report back to the driver the results of the Vadalog program execution.

![Kubernetes cluster mode architecture diagram](dp-k8s-cluster.png?raw=true)

In Cluster mode, the driver run inside the cluster in a worker node inside a pod. From inside the cluster the driver contacts the Kubernetes Api Server on the control plane node and asks to schedule executors, which are scheduled on pods on the worker nodes. The driver communicates with executors which report back to the driver the results of the Vadalog program execution.

### DP Vadalog in Local Mode

In local mode, the driver, the master and the executor run in a single JVM resident in the workstation where the Vadalog application runs.
