package one.awesum

import com.apollographql.apollo.ApolloCall
import com.apollographql.apollo.ApolloClient
import com.apollographql.apollo.api.Response
import com.apollographql.apollo.exception.ApolloException
import okhttp3.OkHttpClient
import one.awesum.github.TestQuery

private val lock = java.lang.Object()

class AwesomeOne {

    fun start() {
        println("Hello World.")
        val client = ApolloClient
                .builder()
                .okHttpClient(OkHttpClient.Builder().build())
                .serverUrl("https://api.github.com/graphql")
                .build();
        val query = TestQuery.builder()
                .owner("apollographql")
                .name("apollo-android")
                .build();
        client.query(query).enqueue(object : ApolloCall.Callback<TestQuery.Data>() {
            override fun onFailure(e: ApolloException) {
                println("failure: $e")
                lock.notify()
                TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
            }

            override fun onResponse(response: Response<TestQuery.Data>) {
                println("We got a response!")
                synchronized(lock) {
                    lock.notify()
                }
            }

        })
    }
}

fun main(args: Array<String>) {
    val awesum = AwesomeOne()
    awesum.start()
    synchronized(lock) {
        lock.wait()
        println("Done waiting.")
    }

}
