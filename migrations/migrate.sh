if [ $# -ne 1 ]; then
	echo usage: source ./migrate.sh {new_version}
	return;
fi

res=`echo 'USE bot_tqk3_5; SELECT version FROM migrations ORDER BY id DESC LIMIT 1;' | mysql -uroot`
a=(`echo $res`)
before=${a[1]}
echo current version: $before

after=$1
if [ $before = $after ]; then
	echo no change
elif [ -f $after.sql ]; then
	diff="out/${before}_to_$after.sql"
	mysqldef -uroot bot_tqk3_5 < $after.sql > $diff
	query="INSERT INTO migrations (version) VALUES ('$after');"
	res=`echo "USE bot_tqk3_5; $query" | mysql -uroot`
	echo $query >> $diff

	res=`echo 'USE bot_tqk3_5; SELECT version FROM migrations ORDER BY id DESC LIMIT 1;' | mysql -uroot`
	a=(`echo $res`)
	done=${a[1]}
	echo current version: $done
else
	echo file $after.sql not found
fi
