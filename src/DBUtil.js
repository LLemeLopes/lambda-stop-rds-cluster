import RDS from 'aws-sdk/clients/rds'
import config from './config'


class DBUtil {

  constructor(tags, cluster) {
    this.tags = tags
    this.cluster = cluster
    this.rds = new RDS()
  }

  async stopDBCluster() {
    console.log(`tags are ${JSON.stringify(this.tags.TagList)}`)
    const isStop = this.tags.TagList.find(element => element.Key === config.key && element.Value === 'true')
    console.log(`${this.cluster.DBClusterIdentifier}: to stop or not.. ${JSON.stringify(isStop)}`)

    if (isStop) {
      const params = {
        DBClusterIdentifier: `${this.cluster.DBClusterIdentifier}`, /* required */
      }
      try {
        const data = await this.rds.stopDBCluster(params).promise()
        console.log(`stopped db cluster ${this.cluster.DBClusterIdentifier},
           status is now ${data.DBCluster.DBClusterStatus}`)
      } catch (error) {
        console.warn(`failed to stop db cluster ${this.cluster.DBClusterIdentifier}. error is: ${error}`)
      }
    }
  }
}

export default DBUtil
