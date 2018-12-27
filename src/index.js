import RDS from 'aws-sdk/clients/rds' // eslint-disable-line import/no-extraneous-dependencies
import DBUtil from './DBUtil'


module.exports.stop = async (event, context, callback) => {
  const rds = new RDS()

  const list = await rds.describeDBClusters().promise()
  console.log(list)
  console.log(`db cluster length is ${list.DBClusters.length}`)


  for (const cluster of list.DBClusters) {
    console.log(`rds ${cluster.DBClusterIdentifier} arn is ${cluster.DBClusterArn}`)
    const params = {
      ResourceName: `${cluster.DBClusterArn}`, /* required */
    }
  /** stop db instances with tag autoStopInstance and value true */
    const tags = await rds.listTagsForResource(params).promise()
    const dbUtil = new DBUtil(tags, cluster)
    await dbUtil.stopDBCluster()
  }


  callback(null, { message: 'Stop function invoked successfully', event })
}
