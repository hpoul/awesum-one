
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath("com.apollographql.apollo:gradle-plugin:0.3.3")
    }
}

apply {
    plugin("com.apollographql.android")
}

plugins {
    kotlin("jvm")
    application
    idea
    java
}

application {
    mainClassName = "samples.HelloWorldKt"
}

java.sourceSets["main"].java {
    srcDir("$buildDir/generated/source/apollo")
}

idea {
    module {
        // Marks the already(!) added srcDir as "generated"
        generatedSourceDirs.add(file("$buildDir/generated/source/apollo"))
    }
}

dependencies {
    compile(kotlin("stdlib"))
}

repositories {
    jcenter()
}

