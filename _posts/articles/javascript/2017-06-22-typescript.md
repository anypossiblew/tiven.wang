---
layout: post
title: TypeScript Language Overview
excerpt: "TypeScript is a superset of JavaScript which primarily provides optional static typing, classes and interfaces. One of the big benefits is to enable IDEs to provide a richer environment for spotting common errors as you type the code. For a large JavaScript project, adopting TypeScript might result in more robust software, while still being deployable where a regular JavaScript application would run."
modified: 2017-06-22T17:00:00-00:00
categories: articles
tags: [TypeScript, Webpack, JavaScript]
image:
  feature: nationalgeographic/mountain-goat.jpg
comments: true
share: true
references:
  - title: "Github - The TypeScript Handbook is a comprehensive guide to the TypeScript language"
    url: "https://github.com/Microsoft/TypeScript-Handbook/"
  - title: "Stack Overflow - What is TypeScript and why would I use it in place of JavaScript?"
    url: "https://stackoverflow.com/questions/12694530/what-is-typescript-and-why-would-i-use-it-in-place-of-javascript"
---

> 落基山羊 又名白山羊（[Mountain Goat](https://en.wikipedia.org/wiki/Mountain_goat)）是北美洲一种类似山羊的动物，它不是真正的山羊，但归入山羚羊一类。原产地在阿拉斯加东南部往华盛顿州、爱达荷州及蒙大拿州一带，后被引入其它州。 落基山羊十分敏捷，是攀岩、跳跃的能手。它们的蹄上有一圈突出的外缘和一块儿柔软的内垫，使其能在光滑的表面产生足够的摩擦力。列入《世界自然保护联盟》（IUCN） 2008年濒危物种红色名录ver 3.1——低危（LC）。

* TOC
{:toc}

## what others say

### say 1

[TypeScript][TypeScript] is a superset of JavaScript which primarily provides optional static typing, classes and interfaces. One of the big benefits is to enable IDEs to provide a richer environment for spotting common errors as you type the code.

To get an idea of what I mean, watch [Microsoft's introductory video](http://channel9.msdn.com/posts/Anders-Hejlsberg-Introducing-TypeScript) on the language.

For a large JavaScript project, adopting [TypeScript][TypeScript] might result in more robust software, while still being deployable where a regular JavaScript application would run.

It is open source, but you only get the clever Intellisense as you type if you use a supported IDE. Initially, this was only Microsoft's Visual Studio (also noted in blog post from Miguel de Icaza). These days, other IDEs offer [TypeScript][TypeScript] support too.

#### Are there other technologies like it?

There's [CoffeeScript][CoffeeScript], but that really serves a different purpose. IMHO, [CoffeeScript][CoffeeScript] provides readability for humans, but [TypeScript][TypeScript] also provides deep readability for tools through its optional static typing (see this recent blog post for a little more critique). There's also Dart but that's a full on replacement for JavaScript (though it can produce JavaScript code)

### say 2

TypeScript is finding a lot more adoption now with several popular frameworks being written in TypeScript. The reasons why you should choose TypeScript instead of JavaScript are many now.

#### Relation to JavaScript

JavaScript is standardized through the ECMAScript standards. Not all browsers in use support all features of newer ECMAScript standards (see this table). TypeScript supports new ECMAScript standards and compiles them to (older) ECMAScript targets of your choosing (current targets are 3, 5 and 6 [a.k.a. 2015]). This means that you can use features of ES2015 and beyond, like modules, lambda functions, classes, the spread operator, destructuring, today. It also adds type support of course, which is not part of any ECMAScript standard and may likely never be due to the interpreted nature instead of compiled nature of JavaScript. The type system of TypeScript is relatively rich and includes: interfaces, enums, hybrid types, generics, union and intersection types, access modifiers and much more. The official website of TypeScript gives an overview of these features.

#### Relation to other JavaScript targeting languages

TypeScript has a unique philosophy compared to other languages that compile to JavaScript. JavaScript code is valid TypeScript code; TypeScript is a superset of JavaScript. You can almost rename your `.js` files to `.ts` files and start using TypeScript. TypeScript files are compiled to readable JavaScript, so that migration back is possible and understanding the compiled TypeScript is not hard at all. This way TypeScript builds on the successes of JavaScript while improving on its weaknesses.

On the one hand, you have future proof tools that take modern ECMAScript standards and compile it down to older JavaScript versions with Babel being the most popular one. On the other hand, you have languages that may totally differ from JavaScript which target JavaScript, like Coffeescript, Clojure, Dart, Elm, Haxe, ScalaJs, and a whole host more (see this list). These languages, though they might be better than where JavaScript's future might ever lead, run a greater risk of not finding enough adoption for their futures to be guaranteed. You might also have more trouble finding experienced developers for some of these languages, though the ones you will find can often be more enthusiastic. Interop with JavaScript can also be a bit more involved, since they are farther removed from what JavaScript actually is.

TypeScript sits in between these two extremes, thus balancing the risk. TypeScript is not a risky choice by any standard. It takes very little effort to get used to if you are known to JavaScript, since it is not a completely different language, has excellent JavaScript interoperability support and it has seen a lot of adoption recently.

#### Optionally static typing and type inference

JavaScript is dynamically typed. This means JavaScript does not know what type a variable is until it is actually instantiated at run-time. This also means that it may be too late. TypeScript adds type support to JavaScript. Bugs that are caused by false assumptions of some variable being of a certain type can be completely eradicated if you play your cards right; how strict you type your code or if you type your code at all is up to you.

TypeScript makes typing a bit easier and a lot less explicit by the usage of type inference. For example: `var x = "hello"` in TypeScript is the same as `var x : string = "hello"`. The type is simply inferred from its use. Even it you don't explicitly type the types, they are still there to save you from doing something which otherwise would result in a run-time error.

TypeScript is optionally typed by default. For example `function divideByTwo(x) { return  x / 2 }` is a valid function in TypeScript which can be called with any kind of parameter, even though calling it with a string will obviously result in a runtime error. Just like you are used to in JavaScript. This works, because when no type was explicitly assigned and the type could not be inferred, like in the divideByTwo example, TypeScript will implicitly assign the type `any`. This means the divideByTwo function's type signature automatically becomes `function divideByTwo(x : any) : any`. There is a compiler flag to disallow this behavior: `--noImplicitAny`. Enabling this flag gives you a greater degree of safety, but also means you will have to do more typing.

Types have a cost associated with them. First of all there is a learning curve, and second of all, of course, it will cost you a bit more time to set up a codebase using proper strict typing too. In my experience, these costs are totally worth it on any serious codebase you are sharing with others. [A Large Scale Study of Programming Languages and Code Quality in Github](http://macbeth.cs.ucdavis.edu/lang_study.pdf) suggests that "that statically typed languages in general are less defect prone than the dynamic types, and that strong typing is better than weak typing in the same regard."

It is interesting to note that this very same paper finds that TypeScript is less error prone then JavaScript:

> For those with positive coefficients we can expect that the language is associated with, ceteris paribus, a greater number of defect fixes. These languages include C, C++, JavaScript, Objective-C, Php, and Python. The languages Clojure, Haskell, Ruby, Scala, and TypeScript, all have negative coefficients implying that these languages are less likely than the average to result in defect fixing commits.

#### Enhanced IDE support

The development experience with TypeScript is a great improvement over JavaScript. The IDE is informed in real-time by the TypeScript compiler on its rich type information. This gives a couple of major advantages. For example, with TypeScript you can safely do refactorings like renames across your entire codebase. Through code completion you can get inline help on whatever functions a library might offer. No more need to remember them or look them up in online references. Compilation errors are reported directly in the IDE with a red squiggly line while you are busy coding. All in all this allows for a significant gain in productivity compared to working with JavaScript. One can spend more time coding and less time debugging.

There is a wide range of IDEs that have excellent support for TypeScript, like Visual Studio & VS code, Atom, Sublime, and IntelliJ/WebStorm.

#### Strict null checks

Runtime errors of the form `cannot read property 'x' of undefined` or `undefined is not a function` are very commonly caused by bugs in JavaScript code. Out of the box TypeScript already reduces the probability of these kinds of errors occurring, since one cannot use a variable that is not known to the TypeScript compiler (with the exception of properties of any typed variables). It is still possible though to mistakenly utilize a variable that is set to undefined. However, with the 2.0 version of TypeScript you can eliminate these kinds of errors all together through the usage of non-nullable types. This works as follows:

With strict null checks enabled (`--strictNullChecks` compiler flag) the TypeScript compiler will not allow `undefined` to be assigned to a variable unless you explicitly declare it to be of nullable type. For example, `let x : number = undefined` will result in a compile error. This fits perfectly with type theory, since `undefined` is not a number. One can define x to be a sum type of `number` and `undefined` to correct this: `let x : number | undefined = undefined`. The short hand notation is `let x : number? = undefined`.

Once a type is known to be nullable, meaning it is of a type that can also be of the value null or undefined, the TypeScript compiler can determine through control flow based type analysis whether or not your code can safely use a variable or not. In other words when you check a variable is undefined through for example an if statement the TypeScript compiler will infer that the type in that branch of your code's control flow is not anymore nullable and therefore can safely be used. Here is a simple example:

```javascript
let x : number?;
if (x !== undefined) x += 1; // this line will compile, because x is checked.
x += 1; // this line will fail compilation, because x might be undefined.
```

During the build 2016 conference co-designer of TypeScript Anders Hejlsberg gave a detailed explanation and demonstration of this feature: video (from 44:30 to 56:30).

#### Compilation

To use TypeScript you need a build process to compile to JavaScript code. The build process generally takes only a couple of seconds depending of course on the size of your project. The TypeScript compiler supports incremental compilation (--watch compiler flag), so that all subsequent changes can be compiled at greater speed.

The TypeScript compiler can inline source map information in the generated .js files or create separate .map files. Source map information can be used by debugging utilities like the Chrome DevTools and other IDE's to relate the lines in the JavaScript to the ones that generated them in the TypeScript. This makes it possible for you to set breakpoints and inspect variables during runtime directly on your TypeScript code. Source map information works pretty good, it was around long before TypeScript, but debugging TypeScript is generally not as great as when using JavaScript directly. Take the  this keyword for example. Due to the changed semantics of the this keyword around closures since ES2015, this may actually exists during runtime as a variable called `_this` (see this answer). This may confuse you during debugging, but generally is not a problem if you know about it or inspect the JavaScript code. It should be noted that Babel suffers the exact same kind of issue.

There are a few other tricks the TypeScript compiler can do, like generating intercepting code based on decorators, generating module loading code for different module systems and parsing JSX. However, you will likely require a build tool besides the Typescript compiler. For example if you want to compress your code you will have to add other tools to your build process to do so.

There are TypeScript compilation plugins available for Webpack, Gulp, Grunt and pretty much any other JavaScript build tool out there. The TypeScript documentation has a section on integrating with build tools covering them all. A linter is also available in case you would like even more build time checking. There are also a great number of seed projects out there that will get you started with TypeScript in combination with a bunch of other technologies like Angular 2, React, Ember, SystemJs, WebPack, Gulp, etc.

#### JavaScript interoperability

Since TypeScript is so closely related to JavaScript it has great interoperability capabilities, but some extra work is required to work with JavaScript libraries in TypeScript. TypeScript definitions are needed so that the TypeScript compiler understands that function calls like _.groupBy or angular.copy or $.fadeOut are not in fact illegal statements. The definitions for these functions are placed in `.d.ts` files.

The simplest form a definition can take is to allow an identifier to be used in any way. For example, when using Lodash, a single line definition file declare var _ : any will allow you to call any function you want on _, but then of course you are also still able to make mistakes: _.foobar() would be a legal TypeScript call, but is of course an illegal call at run-time. If you want proper type support and code completion your definition file needs to to be more exact (see lodash definitions for an example).

Npm modules that come pre-packaged with their own type definitions are automatically understood by the TypeScript compiler (see documentation). For pretty much any other semi-popular JavaScript library that does not include its own definitions (most projects at this point) somebody out there has already made a `.d.ts` file. These can be downloaded and managed with a command line tool called Typings. Typings gets most of its type definitions from a Github repository called DefinitelyTyped, but is also able to get them via other source like Github, Npm, Bower, etc. After installing Typings you can run `typings install` lodash on the command-line in your project directory and you will be ready to start using Lodash. Now your IDE will tell you exactly which Lodash functions are available when you type _. in your editor.

There is one caveat: the TypeScript definitions must match the version of the library you are using at runtime. If they do not, TypeScript might disallow you from calling a function or dereferencing a variable that exist or allow you to call a function or dereference a variable that does not exist. Typings uses a registry to be able to provide different versions of definitions. This is a fairly recent development and to be honest there are not a lot of different versions of libraries available yet, so often times times it is simply the best to use the latest version of a library as definitions tend to be up to date.

To be honest, there is a slight hassle to this and it may be one of the reasons you do not choose TypeScript, but instead go for something like Babel that does not suffer from having to get type definitions at all. On the other hand, if you know what you are doing you can easily overcome any kind of issues caused by incorrect or missing definition files.

#### Converting from JavaScript to TypeScript

Any .js file can be renamed to a .ts and ran through the TypeScript compiler to get syntactically the same JavaScript code as an output (if it was syntactically correct in the first place). Even when the TypeScript compiler gets compilation errors it will still produce a .js file. It can even accept .js files as input with the --allowJs flag. This allows you to start with TypeScript right away. Unfortunately compilation errors are likely to occur in the beginning. One does need to remember that these are not show-stopping errors like you may be used to with other compilers.

The compilation errors one gets in the beginning when converting a JavaScript project to a TypeScript project are unavoidable by TypeScript's nature. TypeScript checks all code for validity and thus it needs to know about all functions and variables that are used. Thus type definitions need to be in place for all of them otherwise compilation errors are bound to occur. As mentioned in the chapter above, for pretty much any JavaScript framework there are `.d.ts` files that can easily be acquired with a few `typings install` commands. It might however be that you've used some obscure library for which no TypeScript definitions are available or that you've polyfilled some JavaScript primitives. In that case you must supply type definitions for these bits in order for the compilation errors to dissapear. Just create a `.d.ts` file and include it in the tsconfig.json's files array, so that it is always considered by the TypeScript compiler. In it declare those bits that TypeScript does not know about as type any. Once you've eliminated all errors you can gradually introduce typing to those parts according to your needs.

Some work on (re)configuring your build pipeline will also be needed to get TypeScript into the build pipeline. As mentioned in the chapter on compilation there are plenty of good resources out there and I encourage you to look for seed projects that use the combination of tools you want to be working with.

The biggest hurdle is the learning curve. I encourage you to play around with a small project at first. Look how it works, how it builds, which files it uses, how it is configured, how it functions in your IDE, how it is structured, which tools it uses, etc. Converting a large JavaScript codebase to TypeScript is very doable when you know what you are doing, but it might be frustrating when you don't.

#### Adoption

TypeScript is open source (Apache 2 licensed, see [Github](https://github.com/Microsoft/TypeScript)) and backed by Microsoft. [Anders Hejlsberg](https://en.wikipedia.org/wiki/Anders_Hejlsberg), the lead architect of C# is spearheading the project. It's a very active project; the TypeScript team has been releasing a lot of new features in the last few years and a lot of great ones are still planned to come (see the [roadmap](https://github.com/Microsoft/TypeScript/wiki/Roadmap)). It also is currently trending (see [google trends](https://www.google.com/trends/explore#q=typescript)). Npm downloads have increased 20 fold since last year. In February 2016 TypeScript had over a million downloads per month ([source](https://devchat.tv/js-jabber/209-jsj-typescript-with-anders-hejlsberg)). Many great projects are coded nowadays using TypeScript, most notably [Angular 2][angular.io] and [RxJs][RxJs].

## Quick Start

`npm install -g typescript`

Create file __*greeter.ts*__

```javascript
interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user = { firstName: "Jane", lastName: "User" };

document.body.innerHTML = greeter(user);
```

`tsc greeter.ts`

### Gulp

[Gulp](https://www.typescriptlang.org/docs/handbook/gulp.html)

### Webpack

[TypeScript]:http://www.typescriptlang.org/
[CoffeeScript]:http://coffeescript.org/
[angular.io]:https://angular.io/
[RxJs]:http://reactivex.io/rxjs/
